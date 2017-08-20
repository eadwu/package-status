/* @flow */
import DOMManager from './element'
import packageManager from './handler'

import { setDiff, runDiff } from './helpers'
import { CompositeDisposable } from 'atom'
import type { statusBar } from './status-bar'

const { config } = atom

module.exports = {
  DOMHandler: Object,
  statusRoot: Object,
  packageList: Set,
  subscriptions: CompositeDisposable,

  consumeStatusBar: function (service: statusBar) {
    this.statusRoot = service.addLeftTile({
      item: this.DOMHandler.root || this.DOMHandler.generateRoot(),
      priority: 100
    })
  },

  activate: function () {
    const _this: Object = this
    const DOMHandler = _this.DOMHandler = new DOMManager()
    const subscriptions = _this.subscriptions = new CompositeDisposable()

    _this.packageList = new Set(config.get('package-status.packageList'))
    packageManager(new Set(), _this.packageList, DOMHandler)

    subscriptions.add(config.onDidChange('package-status.packageList', (event) => {
      const { oldValue, newValue } = event
      _this.packageList = new Set(newValue)
      packageManager(new Set(oldValue), _this.packageList, DOMHandler)
    }))
    subscriptions.add(config.onDidChange('core.disabledPackages', (event) => {
      const { oldValue, newValue } = event
      const oldDisabledPackageList: Set<string> = new Set(oldValue)
      const newDisabledPackageList: Set<string> = new Set(newValue)
      let diffList: Set<string>

      if (oldDisabledPackageList.size > newDisabledPackageList.size) {
        diffList = setDiff(oldDisabledPackageList, newDisabledPackageList)
      } else diffList = setDiff(newDisabledPackageList, oldDisabledPackageList)
      runDiff(diffList, (pkg) => {
        DOMHandler.updateChild(DOMHandler.root.querySelector(`#${pkg}`), pkg)
      })
    }))
  },
  deactivate: function () {
    const { statusRoot, subscriptions } = this
    if (statusRoot) statusRoot.destroy()
    subscriptions.dispose()
  }
}
