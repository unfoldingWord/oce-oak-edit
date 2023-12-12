import React, { useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { documentDir, extname } from '@tauri-apps/api/path'
import { readTextFile } from "@tauri-apps/plugin-fs"
import SimpleEditor from './SimpleEditor'
// import { fileOpen } from 'browser-fs-access'
import HideAppBar from './HideAppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

export default function AppLayout() {
  const [usfmText, setUsfmText] = useState()
  const [loading, setLoading] = useState(false)
  const [usfmFileLoaded, setUsfmFileLoaded] = useState(false)
  const [filePath, setFilePath] = useState()

  const handleOpen = async () => {
    // Open a selection dialog for directories
    setLoading(true)
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'USFM (Text) files',
        extensions: ['usfm']
      }],
      defaultPath: await documentDir(),
    })
    if (selected !== null) {
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
    <div style={{paddingTop: '100px'}}>
        { usfmFileLoaded && <SimpleEditor {...editorProps } />}
    </div>

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {(!usfmFileLoaded) && (<HideAppBar>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}
            >
              OCE OAK EDIT
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleOpen}
              aria-label="print preview"
              sx={{ ml: 'auto' }}
            >
              <FolderOpenIcon/>
            </IconButton>
          </Toolbar>
        </HideAppBar>)}
      </Paper>
      {(!loading) && appBarAndWorkSpace}
      </Box>
  )
}
