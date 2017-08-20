/* @flow */
import { setDiff, runDiff } from './helpers'

function packageManager (oldList: Set<string>, newList: Set<string>, DOMHandler: Object) {
  const oldDiff: Set<string> = setDiff(oldList, newList)
  const newDiff: Set<string> = setDiff(newList, oldList)

  runDiff(oldDiff, (pkg) => { DOMHandler.deleteChild(pkg) })
  runDiff(newDiff, (pkg) => { DOMHandler.createChild(pkg) })
}

module.exports = packageManager
