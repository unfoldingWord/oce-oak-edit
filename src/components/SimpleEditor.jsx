import React, { useState, useEffect, useMemo } from "react"
import { Editor } from '@oce-editor-tools/mui-core'
import EpiteleteHtml from "epitelete-html"
import { usfm2perf } from "../helpers/usfm2perf"
// import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from "@tauri-apps/plugin-fs"
// import { documentDir, join } from '@tauri-apps/api/path'

const SaveFile = async (fileName,text) => {
  try {
    // const usePath = await documentDir()
    // const defaultPath = await join(usePath, fileName)
    // let filepath = await save({
    //   filters: [{
    //     name: 'USFM and MD Text files',
    //     extensions: ['md', 'usfm']
    //   }],
    //   defaultPath,
    // })
    await writeFile({ contents: text, path: fileName, });
  } catch (e) {
    console.log(e);
  }
}

function SimpleEditor({
  filePath,
  reference,
  onReferenceSelected,
  docSetId,
  usfmText,
  ...props
}) {
  const verbose = true;
  const [ready, setReady] = useState(false);
  const epiteleteHtml = useMemo(
    () =>
      new EpiteleteHtml({
        proskomma: undefined,
        docSetId,
        options: { historySize: 100 },
      }),
    []
  );

  const onSave = (bookCode, usfmText) => {
    console.log(`save button clicked: ${docSetId} ${bookCode}`, usfmText)
    SaveFile(filePath,usfmText)
  };

  useEffect(() => {
    async function loadUsfm() {
      const tempPerf = usfm2perf(usfmText)
      await epiteleteHtml.sideloadPerf('XYZ', tempPerf)
      setReady(true)
    }
    if (epiteleteHtml) loadUsfm()
  }, [epiteleteHtml])

  const onRenderToolbar = ({ items }) => {
    const _items = items.filter((item) => item?.key !== "print")
    return [..._items]
  }

  const editorProps = {
    epiteleteHtml,
    bookId: 'XYZ',
    reference,
    onReferenceSelected,
    onSave,
    onRenderToolbar,
    verbose,
    ...props,
  }

  return <>{ready ? <Editor {...editorProps} /> : "Loading..."}</>
}

export default SimpleEditor