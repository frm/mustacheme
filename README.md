# mustacheme

Always wanted to look classy but didn't know how to?

Looking for a new picture for that Christmas card that everyone simply ignores
anyway?

Want to be the annoying guy on your company's Slack that is always making weird
practical jokes?

I got your back.

`mustacheme` adds mustaches to every face in a picture.

You can run it locally but if you don't care enough, I built you a web API:

`curl -X POST -F 'image=@./path/to/file.png' http://mustacheme.mendes.codes -o
mustache.png`

Don't let nothing stop you from annoying your coworkers to hell with stupid
pictures of them with mustaches.

## Things you can do

* Add a mustache to your selfie and post it on Facebook with the caption
  "#hipstersamirite ;)"
* Add a mustache to your 100x100 selfie and use it as a wallpaper. Repeated.
* Take a creepshot of your coworker. Add a mustache. Email it to them. Everyday.
* Add a mustache to a picture of your boss and use it in Slack. Get a raise because of your proactivity and out-of-the-box thinking.
* Make a fake ID card with your mustache selfie and tell everyone you're related
  to Tom Selleck. Start going to Hollywood parties. Meet Tom Selleck.

## Installation

1. Follow [these instructions](https://gist.github.com/ageitgey/629d75c1baac34dfa5ca2a1928a7aeaf).
2. `git clone https://github.com/justmendes/mustacheme`
3. `bin/setup`
4. `bin/server` if you want to run the web app

## Usage

```bash
# Add a mustache and open it in the file viewer
python3 lib/mustacheme.py <file>

# Add a mustache and output the base64
python3 lib/mustacheme.py <file> -b

# Add a mustache and save it to a file
python3 lib/mustacheme.py <file> -o <output>

# Run the webapp
yarn start
```

### Web application

It's available at
[`http://mustacheme.mendes.codes`](http://mustacheme.mendes.codes).

POST to `/` an image data through a multipart form. Or:

`curl -X POST -F 'image=@./path/to/file.png' http://mustacheme.mendes.codes -o
mustache.png`

## I WANT TO HELP MAKE MORE MUSTACHES

I like your enthusiasm. Open a [pull
request](https://github.com/justmendes/mustacheme/pulls). Some things to do:

* [ ] add moooooore mustaches (python/javascript)
* [ ] add mustaches to gifs (python)
* [ ] add mustaches to a video (python)
* [ ] stream the local camera and add mustaches (python)
* [ ] add a web interface (javascript/html)

Feel free to make suggestions as well and to [open an
issue](https://github.com/justmendes/mustacheme/issues/new) if you found some of
them bugs.
