/**
 * Flags a className that combines two or more literal Tailwind strings which
 * conflict, without routing them through cn().
 *
 * JSS resolved this by stylesheet order: a later rule won. Tailwind does not -
 * both utilities are emitted and CSS emission order decides, which is not the
 * order they appear in the className. cn() (clsx + tailwind-merge) makes the
 * later value win explicitly, which is what the JSS it replaced did.
 */
const fs=require('fs'),cp=require('child_process');
const { twMerge } = require('tailwind-merge')
const files=cp.execSync('find src -name "*.js" -o -name "*.jsx"',{encoding:'utf8'}).trim().split('\n');
const found=[];
for(const f of files){
  const s=fs.readFileSync(f,'utf8');
  // className built from 2+ literal Tailwind strings via clsx/template/concat,
  // NOT already going through cn()/twMerge
  const re=/className=\{(?!cn\()([^}]*?"[^"]*(?:\[&|flex|bg-|text-|w-|h-)[^"]*"[^}]*?"[^"]*(?:\[&|flex|bg-|text-|w-|h-)[^"]*"[^}]*)\}/gs;
  let m;
  while((m=re.exec(s))){
    const strings=[...m[1].matchAll(/"([^"]+)"/g)].map(x=>x[1]).filter(x=>/[a-z]-|\[&/.test(x));
    if(strings.length<2) continue;
    const joined=strings.join(' ');
    const merged=twMerge(joined);
    if(merged.split(' ').length !== joined.split(' ').length){
      found.push({f, line:s.slice(0,m.index).split('\n').length,
        dropped: joined.split(' ').filter(c=>!merged.split(' ').includes(c))});
    }
  }
}
if (!found.length) {
  console.log(`OK - ${files.length} files, no unresolved Tailwind class conflicts`)
  process.exit(0)
}
console.error('Conflicting Tailwind classes combined without cn():')
found.forEach((x) => console.error(`  ${x.f}:${x.line}\n     conflicting: ${x.dropped.join(' ')}`))
console.error('\nWrap these in cn() so the later value wins, as the JSS did.')
process.exit(1)
