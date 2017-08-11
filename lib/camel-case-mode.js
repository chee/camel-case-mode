'use babel'

import {CompositeDisposable} from 'atom'
import {MODE_CLASS} from '../constants'

export default {
  camelCaseModeView: null,
  modalPanel: null,
  subscriptions: null,
  isEnabled: false,
  editor: null,
  editorView: null,
  capitalizeNextDisposable: null,

  activate (state) {
    this.capitalizeNextDisposable = new CompositeDisposable()
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'camel-case-mode:toggle': () => this.toggle(),
      'camel-case-mode:capitalize-next': () => this.capitalizeNext()
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  serialize () {
    return null
  },

  enable () {
    this.isEnabled = true
    this.editor = atom.workspace.getActiveTextEditor()
    this.editorView = atom.views.getView(this.editor)
    this.editorView.classList.add(MODE_CLASS)
    this.editor.onDidDestroy(() => this.disable)
  },

  disable () {
    this.isEnabled = false
    this.capitalizeNextDisposable && this.capitalizeNextDisposable.dispose()
    this.editorView.classList.remove(MODE_CLASS)
    this.editorView = null
  },

  toggle () {
    console.log(this)
    return this.isEnabled
      ? this.disable()
      : this.enable()
  },

  capitalizeNext () {
    this.capitalizeNextDisposable.add(this.editor.onWillInsertText(({text}) => {
      if (text === ' ') {
        return this.disable()
      }
      this.editor.insertText(text.toUpperCase())
    }))
  }
}
