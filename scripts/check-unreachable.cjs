/**
 * Lists source files not reachable from src/index.js by any static import,
 * re-export, or dynamic import(). Comments are stripped first, so a
 * commented-out import does not count as a reference.
 *
 * Reported, not enforced: src/ui/* is intentionally not adopted yet.
 */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const SRC=path.resolve('src');
const all=cp.execSync('find src -name "*.js" -o -name "*.jsx"',{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const resolve=(from,spec)=>{
  if(!spec.startsWith('.'))return null;
  const b=path.resolve(path.dirname(from),spec);
  for(const c of [b+'.js',b+'/index.js',b+'.jsx',b+'/index.jsx',b]) if(fs.existsSync(c)&&fs.statSync(c).isFile())return c;
  return null;
};
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');
const seen=new Set();
function walk(f){
  if(seen.has(f))return; seen.add(f);
  const s=strip(fs.readFileSync(f,'utf8'));
  const re=/(?:import|export)\s+(?:[\s\S]*?\sfrom\s*)?['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)/g;
  let m; while((m=re.exec(s))){ const r=resolve(f,m[1]||m[2]); if(r) walk(r); }
}
walk(path.resolve('src/index.js'));
const orphans=all.filter(f=>!seen.has(path.resolve(f)) && !/\.(test|spec)\./.test(f));
console.log(`reachable from src/index.js: ${seen.size}   unreachable: ${orphans.length}`);
orphans.slice(0,30).forEach(o=>console.log('  '+o));
if(orphans.length>30) console.log(`  ... +${orphans.length-30} more`);
