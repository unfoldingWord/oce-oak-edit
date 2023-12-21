import React, { useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { documentDir, extname } from '@tauri-apps/api/path'
import { readTextFile } from "@tauri-apps/plugin-fs"
import SimpleEditor from './SimpleEditor'
// import { fileOpen } from 'browser-fs-access'
import Header from './Header'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress';

export default function AppLayout() {
  const [usfmText, setUsfmText] = useState()
  const [loading, setLoading] = useState(false)
  const [usfmFileLoaded, setUsfmFileLoaded] = useState(false)
  const [filePath, setFilePath] = useState()

  const handleOpen = async () => {
    // Open a selection dialog for directories
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'USFM (Text) files',
        extensions: ['usfm']
      }],
      defaultPath: await documentDir(),
    })
    if (selected !== null) {
      setLoading(true)
      const _filePath = selected?.path
      setFilePath(_filePath)
      const extStr = await extname(_filePath)
      if (extStr === "usfm") {
        const contents = await readTextFile(_filePath)
        setUsfmText(contents)
        setUsfmFileLoaded(true)
      } else {
        console.log("invalid file extension")
      }
    } else {
      console.log("user cancelled the selection")
    }
    setLoading(false)
  }

  const editorProps = {
    docSetId: 'abc-xyz',
    filePath,
    usfmText
  }
 
  const appBarAndWorkSpace = 
    <div>
      { usfmFileLoaded && <SimpleEditor {...editorProps } />}
    </div>

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {!usfmFileLoaded && !loading && 
          (<Header 
            title={"OCE Oak Edit"}
            onOpenClick={handleOpen}
          />)}
      </Paper>
      {!loading ? appBarAndWorkSpace : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            paddingTop: '150px' 
          }}>
          <CircularProgress disableShrink/>
        </Box>
      )}
      </Box>
  )
}
