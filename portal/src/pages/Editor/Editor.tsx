import React, { Component } from 'react'
import SwaggerEditor from 'swagger-editor'

import 'swagger-editor/dist/swagger-editor.css'
import Sidebar from 'components/Sidebar'
import { loadServiceDefinition } from 'services/github'
import LoadingScreen from 'components/LoadingScreen'
import EditorStyles from './editor.styles'

class Editor extends Component<any, any> {
  editor: any
  unsubscribe: any

  constructor(props: any) {
    super(props)
    this.state = { originalDocument: '' }
  }

  async componentDidMount(): Promise<void> {
    if (this.props.isLoggedIn) {
      this.initSwaggerEditor()
    }
  }

  componentDidUpdate(prevProps: any): void {
    const {
      match: { params },
      isLoggedIn,
    } = this.props
    const {
      match: { params: prevParams },
      isLoggedIn: prevIsLoggedIn,
    } = prevProps

    if (params.service !== prevParams.service) {
      loadServiceDefinition(params.service)
        .then(
          (result: { content: string; sha: string }): void => {
            this.setState({ originalDocument: result.content })
            this.editor.specActions.updateSpec(result.content)
            if (this.props.setCurrentDocument) {
              this.props.setCurrentDocument(result.content, result.sha)
            }
          }
        )
        .catch((err): void => console.log(err))
    }

    if (isLoggedIn && isLoggedIn !== prevIsLoggedIn) {
      this.initSwaggerEditor()
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe()
  }

  handleEditorChange = (): void => {
    const {
      setDocumentChanged,
      setCurrentDocument,
      editor: { spec: specInStore },
    } = this.props
    const state: Map<string, any> = this.editor.getStore().getState()
    const spec = state.get('spec').get('spec')
    if (setDocumentChanged) {
      if (spec !== this.state.originalDocument) {
        setDocumentChanged(true)
      } else {
        setDocumentChanged(false)
      }
    }

    if (setCurrentDocument && spec !== specInStore) {
      setCurrentDocument(spec)
    }
  }

  initSwaggerEditor = async (): Promise<void> => {
    if (!this.editor) {
      const {
        match: { params },
        setCurrentDocument,
      } = this.props
      const result: {
        content: string
        sha: string
      } = await loadServiceDefinition(params.service)
      this.editor = SwaggerEditor({})
      this.editor.specActions.updateSpec(result.content)
      this.setState({ originalDocument: result.content })
      if (setCurrentDocument) {
        setCurrentDocument(result.content, result.sha)
      }
      this.unsubscribe = this.editor
        .getStore()
        .subscribe(this.handleEditorChange)
    }
  }

  render(): React.ReactElement {
    return (
      <>
        <EditorStyles />
        {this.props.isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Sidebar />
            <div id="swagger-editor" />
          </>
        )}
      </>
    )
  }
}

export default Editor