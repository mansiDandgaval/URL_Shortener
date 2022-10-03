const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortURL = require('./models/url')

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
	const allData = await ShortURL.find()

	const min_count = await ShortURL.find().sort({ count: 1 }).limit(1)
	res.render('index', { shortUrls: allData, min_counts: min_count })
})

app.post('/short', async (req, res) => {
	const fullUrl = req.body.fullUrl

	var su = makeid(2);

	const record = new ShortURL({
		shortUrl: su,
		originalUrl: fullUrl,
		count: 0,
		callTime: Date.now(),
	});

	const new_record = await record.save()
	res.redirect('/')
})

app.get('/:shortid', async (req, res) => {

	const shortid = req.params.shortid
	const update_at = { update_at: Date.now() }
	const rec = await ShortURL.findOne({ shortUrl: shortid })
	if (rec == null) return res.sendStatus(404)
	rec.count++
	await rec.save()
	await ShortURL.updateOne({ callTime: Date.now() })
	res.redirect(rec.originalUrl)
})

app.post('/delete',  (req, res, next) => {
	var id = { id: req.body.to_be_delete };
	ShortURL.findByIdAndDelete((id.id), 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
			res.redirect('/')
            console.log("Data Deleted!");
        }
    });  
});


// Setup your mongodb connection here
mongoose.connect('mongodb://localhost/mansi', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('open', async () => {
	// Wait for mongodb connection before server starts

	app.listen(process.env.PUBLIC_PORT || 5000, () => {
		console.log('Server started')
	})
})

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}