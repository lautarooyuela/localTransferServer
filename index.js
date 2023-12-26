const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const multer = require('multer');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  const publicPath = path.join(__dirname, 'public');

  fs.readdir(publicPath, (err, files) => {
    if (err) {
      console.error('Error al leer el directorio:', err);
      return res.status(500).send('Error interno del servidor');
    }

    const fileInfos = files.map(file => {
      const filePath = path.join(publicPath, file);
      const isDirectory = fs.lstatSync(filePath).isDirectory();
      return {
        name: file,
        isDirectory: isDirectory
      };
    });

    res.render('explorar', { files: fileInfos });
  });
});

app.post('/descargar', (req, res) => {
  const publicPath = path.join(__dirname, 'public');
  const zipPath = path.join(__dirname, 'archivos.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('warning', err => {
    console.warn(err);
  });

  archive.on('error', err => {
    console.error(err);
    res.status(500).send('Error interno del servidor');
  });

  archive.directory(publicPath, false);
  archive.pipe(res.attachment('archivos.zip'));

  archive.finalize();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Utilizamos el nombre original del archivo
  }
});

const upload = multer({ storage: storage });

app.post('/subir', upload.array('archivos'), (req, res) => {

  const archivos = req.files; 
  archivos.forEach(archivo => {
    const newPath = path.join(__dirname, 'uploads', archivo.originalname);
    fs.renameSync(archivo.path, newPath);
  });
  console.log("Archivos Cargados Satisfactoriamente")
  res.redirect('/');
});


app.listen(port, () => {
  /* console.log(`Servidor Express escuchando en http://localhost:${port}`); */
});
