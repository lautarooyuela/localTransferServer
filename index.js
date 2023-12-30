const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('resources'));
app.use(express.json());
app.use(cors());

/////////////////////DB///////////////////
const db = new sqlite3.Database('mensajes.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contenido TEXT NOT NULL
    )
  `);
});
///////////////////////////////////////////

///////////////////Multer//////////////////
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
//////////////////////////////////////////

//////////////////////////////////////////////HUB//////////////////////////////////////
///ENDPOINT
app.get('/', (req, res) => {
  res.redirect('/hub.html');
});

///////////////////////////////////////////////TRANSFER/////////////////////////////////////////////////
///ENDPOINT
app.get('/transfer', (req, res) => {
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

///ENDPOINT
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

///ENDPOINT///
app.post('/subir', upload.array('archivos'), (req, res) => {

  const archivos = req.files; 
  archivos.forEach(archivo => {
    const newPath = path.join(__dirname, 'uploads', archivo.originalname);
    fs.renameSync(archivo.path, newPath);
  });
  console.log("Archivos Cargados Satisfactoriamente")
  res.redirect('/transfer');
});

//////////////////////////////////////////MESSAGES/////////////////////////////////////////////

///ENDPOINT///
app.get('/getMessages', (req, res) => {
  db.all('SELECT * FROM mensajes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

///ENDPOINT///
app.post('/postMessages', (req, res) => {
  const contenido = req.body.contenido;

  if (!contenido) {
    res.status(400).json({ error: 'El contenido del mensaje es obligatorio.' });
    return;
  }

  db.run('INSERT INTO mensajes (contenido) VALUES (?)', [contenido], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ id: this.lastID, contenido });
  });
});

///ENDPOINT///
app.get('/deleteMessages', (req, res) => {
  db.all('DELETE FROM mensajes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


app.listen(port, () => {
  /* console.log(`Servidor Express escuchando en http://localhost:${port}`); */
});
