# Sponsored tweet tracker for @TheLantern

I wanted to keep track of the ratio of sponsored tweets to real content in [The Lantern's Twitter account](https://twitter.com/thelantern/).

If you'd like to contribute, please file a pull request on this repository.

## Notes on the program

The date stamp in `data.csv` is in the Unix format, in seconds since the start of the Unix Epoch. This is because it's how Twitter supplies the time on the timestamp on the tweet:

```html
<span class="_timestamp js-short-timestamp js-relative-timestamp" data-time="1442098720" data-time-ms="1442098720000" data-long-form="true" aria-hidden="true">2h</span>
```

## License

`uberwriter.css` is under the [GPL2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt), from [Uberwriter](https://launchpad.net/uberwriter).

Everything else is [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) or later.
