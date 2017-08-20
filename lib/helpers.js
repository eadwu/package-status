/* @flow */
const { packages } = atom

function setDiff (original: Set<any> | Array<any>, diff: Set<any>): Set<any> {
  let _this: Set<any> = new Set(original)
  for (let value of diff) _this.delete(value)
  return _this
}

function runDiff (target: Set<string>, func: (pkg: string) => void) {
  const installedPackages: Set<string> = new Set(packages.getAvailablePackageNames())
  if (target.size <= 0) return
  for (let value of target) {
    if (installedPackages.has(value)) {
      func(value)
    }
  }
}

exports.setDiff = setDiff
exports.runDiff = runDiff
