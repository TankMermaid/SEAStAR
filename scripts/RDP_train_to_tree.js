// Generated by CoffeeScript 1.6.3
/*
# -------------------------------------------------------------------------- #
# Center for Environmental Genomics
# Copyright (C) 2009-2013 University of Washington.
#
# Authors:
# Vaughn Iverson
# vsi@uw.edu
# -------------------------------------------------------------------------- #
# This file is part of SEAStAR.
#
# SEAStAR is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# SEAStAR is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with SEAStAR.  If not, see <http:#www.gnu.org/licenses/>.
# -------------------------------------------------------------------------- #
*/


(function() {
  var build, error_codes, levels, taxa;

  if (!(process.version.split('.')[1] >= 10)) {
    console.error("ERROR: nodejs version v0.10.0 or greater required.");
    process.exit(1);
  }

  taxa = [];

  levels = {
    rootrank: 0,
    norank: 0,
    domain: 1,
    phylum: 2,
    "class": 3,
    subclass: 3.5,
    order: 4,
    suborder: 4.5,
    family: 5,
    subfamily: 5.5,
    supergenus: 5.75,
    genus: 6
  };

  error_codes = {
    INVALID_INPUT_LINE: 1
  };

  process.on('uncaughtException', function(err) {
    return console.log('Caught exception: ' + err);
  });

  process.stdin.resume();

  process.stdin.setEncoding('utf8');

  build = function(line) {
    var child, i, level, levnum, name, parentid, taxid, _ref, _ref1;
    if (!(line = line.trim())) {
      return;
    }
    if ((_ref = line.split("*"), taxid = _ref[0], name = _ref[1], parentid = _ref[2], levnum = _ref[3], level = _ref[4], _ref).length !== 5) {
      return;
    }
    taxid = parseInt(taxid);
    parentid = parseInt(parentid);
    name = name.replace(/"/g, "");
    level = level.trim();
    if (!(level in levels)) {
      return;
    }
    if (taxa[taxid] != null) {
      taxa[taxid].level = levels[level];
      taxa[taxid].name = name;
      _ref1 = taxa[taxid].sub;
      for (i in _ref1) {
        child = _ref1[i];
        child.length = child.level - taxa[taxid].level;
      }
    } else {
      taxa[taxid] = {
        name: name,
        pop: 0.0,
        cum: 0.0,
        cnt: 0,
        num: 0,
        conf: 0.0,
        w_conf: 0.0,
        level: levels[level],
        length: 0.0,
        sub: {}
      };
    }
    if (taxa[parentid] != null) {
      taxa[parentid].sub[name] = taxa[taxid];
      taxa[taxid].length = taxa[taxid].level - taxa[parentid].level;
    } else {
      if (parentid >= 0) {
        taxa[parentid] = {
          pop: 0.0,
          cum: 0.0,
          cnt: 0,
          num: 0,
          conf: 0.0,
          w_conf: 0.0,
          level: levels[level],
          length: 0.0,
          sub: {}
        };
        taxa[parentid].sub[name] = taxa[taxid];
      }
    }
  };

  process.stdin.on('data', (function() {
    var save;
    save = '';
    return function(c) {
      var i, lines, _i, _len, _results;
      lines = c.split('\n');
      lines[0] = save + lines[0];
      save = lines.pop();
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        i = lines[_i];
        if (i) {
          _results.push(build(i));
        }
      }
      return _results;
    };
  })());

  process.stdin.on('end', function() {
    taxa[0].length = 1;
    console.log(JSON.stringify({
      sub: {
        Root: taxa[0]
      }
    }));
    return process.exit(0);
  });

}).call(this);
