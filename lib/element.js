/* @flow */
const { packages } = atom

function beautifyPackageName (packageName: string): string {
  const splitName: Array<string> = packageName.split('-')
  for (let index = 0; index < splitName.length; index++) {
    const word = splitName[index]
    splitName[index] = word.charAt(0).toUpperCase() + word.slice(1)
  }
  return splitName.join(' ')
}

function replaceClass (element: HTMLElement, oldClass: string, newClass: string) {
  element.classList.remove(oldClass)
  element.classList.add(newClass)
}

module.exports = class {
  root: HTMLDivElement

  constructor () {
    this.generateRoot()
  }

  generateRoot (): HTMLDivElement {
    const core: HTMLDivElement = document.createElement('div')
    core.classList.add('package-status', 'inline-block')
    this.root = core
    return core
  }
  createChild (packageName: string) {
    const _this: Object = this
    const core: HTMLAnchorElement = document.createElement('a')
    core.id = packageName
    core.textContent = beautifyPackageName(packageName)
    core.classList.add('package-status-child')
    if (packages.isPackageDisabled(packageName)) {
      core.classList.add('package--disabled')
    } else core.classList.add('package--enabled')

    core.addEventListener('click', () => {
      _this.refreshChild(core, packageName)
      _this.updateChild(core, packageName)
    })
    _this.root.appendChild(core)
  }
  deleteChild (packageName: string) {
    const element: null | HTMLElement = this.root.querySelector(`#${packageName}`)
    if (element) this.root.removeChild(element)
  }

  refreshChild (element: null | HTMLElement, packageName: string) {
    if (!element) return
    if (packages.isPackageDisabled(packageName)) {
      packages.enablePackage(packageName)
    } else packages.disablePackage(packageName)
  }
  updateChild (element: null | HTMLElement, packageName: string) {
    if (!element) return
    if (!packages.isPackageDisabled(packageName)) {
      replaceClass(element, 'package--disabled', 'package--enabled')
    } else replaceClass(element, 'package--enabled', 'package--disabled')
  }
}
