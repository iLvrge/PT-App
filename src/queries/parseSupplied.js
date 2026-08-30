/**
 * These screens accept data from their parent that may be a JSON string, an
 * array, an empty string, or null. Absent means "fetch it"; present means "use
 * it as given".
 */
export const parseSupplied = (data) => {
  let parsed = data
  try {
    parsed = JSON.parse(data)
  } catch (_) {
    parsed = data
  }
  return parsed
}

export const isAbsent = (parsed) =>
  parsed == null || parsed === '' || (Array.isArray(parsed) && parsed.length === 0)

export default parseSupplied
