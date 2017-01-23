# sensortag-monitoring-station

[![GitHub version](https://badge.fury.io/gh/boennemann%2Fbadges.svg)](http://badge.fury.io/gh/boennemann%2Fbadges)
[![node](https://img.shields.io/node/v/gh-badges.svg?style=flat-square)]()

A simple monitoring station for the [Ti Sensor Tag](http://www.ti.com/tool/cc2650stk). 

## Requirements
1. nodejs
2. mongodb
3. A computer with bluetooth 4.0 

## Installation

```
$ npm install
$ npm start
```

## Usage

1. Turn on the sensor tag
2. start the server
3. wait for a few samples to be collected
4. visit [http://localhost:3000/](http://localhost:3000/) to see your data

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

* v1.0.0 - readme and some documentation
* v0.0.1 - initial build

## Credits

Lots of credit goes to [Sandeep Mistry](https://github.com/sandeepmistry) for creating [the library](https://github.com/sandeepmistry/node-sensortag) I used to read the data from the sensor tag.


## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

