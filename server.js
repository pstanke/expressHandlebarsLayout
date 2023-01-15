const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const formidableMiddleware = require('express-formidable');
const accepts = require('accepts');
const app = express();

app.engine(
  'hbs',
  hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' })
);
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(formidableMiddleware());
// app.use(express.urlencoded({ extended: false }));

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history', { layout: 'dark' });
});

app.post('/contact/send-message', (req, res) => {
  const fileType = accepts(req).types(['.png', '.jpg', '.jpeg', '.gif']);
  const { author, sender, title, message } = req.fields;
  const { projectFile } = req.files;

  if (fileType && author && sender && title && message && projectFile) {
    const ext = path.extname(projectFile.name);
    if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
      res.render('contact', { isSent: true, file: projectFile.name });
    } else {
      res.render('contact', {
        isError: true,
        message: 'File type not accepted',
      });
    }
  } else {
    res.render('contact', {
      isError: true,
      message: "You can't leave fields empty!",
    });
  }
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
