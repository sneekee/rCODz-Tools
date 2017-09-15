var vmButtonStep = function () {
    var self = this;
    self.numberOfButtons = ko.observable(4);
    self.availableColours = ko.observableArray(['red', 'green', 'blue', 'black', 'yellow', 'white'])
    self.buttons = ko.observableArray([]);

    self.buttonList = ko.pureComputed(function () {
        self.buttons.removeAll();
        for (var i = 0; i < self.numberOfButtons(); i++) {
            self.buttons.push(new vmBtn());
        }

        return self.buttons();
    })

    self.solution = ko.pureComputed(function () {

        var btns = parseInt(self.buttons().length);
        switch (btns) {
            case 3:
                /*
                    c1 = (!b!) ? B3 : c2
                    c2 = (BL = g) ? B1 : c3
                    c3 = (sum(r) > 1 ) ? BL(r) : c4
                    c4 = B2
                */

                // c1 = (!b!) ? B3 : c2
                if (!self.hasColour('black'))
                    return '3'

                // c2 = (BL = g) ? B1 : c3
                if (self.buttons()[self.buttons().length - 1].colour() == "green")
                    return '1';

                // c3 = (sum(r) > 1) ? BL(r) : c4
                if (self.getSumOfColour('red') > 1)
                    return self.getLowestIndexForColour('red'); // '3'


                return '2';
                break;
            case 4:
                /*
                    c1 = (sum(y) > 1) && S >= 2 ? BL(y) : c2
                    c2 = (BL(w) && sum(b) = 0) ? B1 : c3
                    c3 = (sum(b!) > 1 ) ? BL : c4
                    c4 = B3
                */

                //c1 = (sum(y) > 1) && S >= 2 ? BL(y) : c2
                if (self.getSumOfColour('yellow') > 1 && self.getRepeatedColourCount() >= 2)
                    return self.getLowestIndexForColour('yellow');

                // c2 = (BL(w) && sum(b) = 0) ? B1 : c3
                if (self.buttons()[self.buttons().length - 1].colour() == "green" && self.getSumOfColour('black') == 0)
                    return 1;

                // c3 = (sum(b!) > 1) ? BL : c4
                if (self.getSumOfColour('black') > 1)
                    return 4;

                return '3';
                break;
            case 5:
                /*
                    c1 = (W <= 3) ? B1 :  c2
                    c2 = (sum(w) = 1 && sum(b) > 1) ? B2 : c3
                    c3 = (sum(r) = 0 && W % 2 = 0 && S < 4) ? BL : c4
                    c4 = B1
                */

                // c1 = (W <= 3) ? B1 :  c2
                if (self.getRepeatedColourCount() <= 3)
                    return '1';

                // c2 = (sum(w) = 1 && sum(b) > 1) ? B2 : c3
                if (self.getSumOfColour('white') == 1 && self.getSumOfColour('black') > 1)
                    return 2

                // c3 = (sum(r) = 0 && W % 2 = 0 && S < 4) ? BL : c4
                if (self.getSumOfColour('red') == 0 && self.getRepeatedColourCount() % 2 == 0 && self.getRepeatedColourCount() < 4)
                    return 5

                return '1';
                break;
            case 6:
                /*
                    c1 = (sum(y) != 0) ? B3 : c2
                    c2 = (sum(b!) = 1 && sum(w) > 1) ? B4 : c3
                    c3 = (S >= 1) && sum(r) > 1 ? B5 : c4
                    c4 = BL
                */

                // c1 = (sum(y) != 0) ? B3 : c2
                if (self.getSumOfColour('yellow') != 0)
                    return 3;

                // c2 = (sum(b!) = 1 && sum(w) > 1) ? B4 : c3
                if (self.getSumOfColour('black') == 1 && self.getSumOfColour('white') > 1)
                    return 4;

                // c3 = (S >= 1) && sum(r) > 1 ? B5 : c4
                if (self.getRepeatedColourCount() >= 1 && self.getSumOfColour('red') > 1)
                    return 5;

                return 6;
                break;
        }

        return 'unknown'
    })

    self.getSumOfColour = function(colour) {
        var count = 0;
        $.each(self.buttons(), function (index, val) {
            if (val.colour() == colour) {
                count++;
            }

        });

        return count;
    }

    self.hasColour = function (colour) {
        var ret = false;
        $.each(self.buttons(), function (index, val) {
            if (val.colour() == colour) {
                ret = true;
                return false;
            }

        });

        return ret;
    }

    self.getLowestIndexForColour = function(colour) {
        var idx = 0;
        $.each(self.buttons(), function (index, val) {
            if (val.colour() == colour) {
                idx = index;
            }

        });

        return idx + 1;
    }

    self.getRepeatedColourCount = function () {
        var data = {
            'red': 0,
            'green': 0,
            'blue': 0,
            'black': 0,
            'yellow': 0,
            'white': 0
        }

        $.each(self.buttons(), function (index, val) {
            data[val.colour()]++;
        });

        var ret = 0;
        for(var i in data){
            if (data[i] > ret)
                ret = data[i]
        }

        return ret;
    }
}

var vmBtn = function () {
    var self = this;
    self.colour = ko.observable();
}

var vmMazeStep = function () {
    var self = this;

    self.dummy = ko.observable();

    self.placing = ko.observable(undefined);
    self.startIcon = $('<i class="fa fa-stop" aria-hidden="true" style="font-size: 40px; color: #ECF044"></i>');
    self.endIcon = $('<i class="fa fa-diamond" aria-hidden="true" style="font-size: 40px; color: #04E1F4"></i>');
    self.startPosition = ko.observable(undefined);
    self.endPosition = ko.observable(undefined);
    self.hasSolution = ko.observable(false);

    self.placeIcon = function (elem) {
        if (!self.placing()) {
            alert('select what location you are setting');
            return;
        }

        var pos = self.parsePosition($(elem).attr('data-xy'));
        var icon = (self.placing() == 'start' ? self.startIcon : self.endIcon);

        if (self.placing() == 'start') {
            self.startPosition(pos);
        } else {
            self.endPosition(pos);
        }


        icon.appendTo(elem);

        self.dummy.notifySubscribers();

        self.placing(undefined);

        $('#mazeGrid').css('cursor', '');
    }

    self.solution = ko.pureComputed(function () {
        self.dummy();

        if (self.startPosition() && self.endPosition()) {
            var sol = undefined;
            var imgLoc = undefined;

            $.each(self.solutions, function (index, value) {
                if (
                    (value.start.x == self.startPosition().x && value.start.y == self.startPosition().y)
                    &&
                    (value.end.x == self.endPosition().x && value.end.y == self.endPosition().y)
                ) {
                    sol = value.solution;
                    imgLoc = value.imageLocation;
                    return false;
                }
            })

            if (sol) {
                self.hasSolution(true);
                $('#solutionImage').css('background-position-x', imgLoc.x + 'px').css('background-position-y', imgLoc.y + 'px')
                return '<span style="font-weight: bold">Your Solution:</span> ' + sol;
            } else {
                self.hasSolution(false);
                return 'No Solution';
            }
        } else {
            self.hasSolution(false);
            return 'place start and end points';
        }
    });

    self.parsePosition = function (xy) {
        var d = xy.split(',');
        return {
            x: parseInt(d[0]),
            y: parseInt(d[1])
        }
    }

    self.solutions = [
        {
            start: { x: 2, y: 2 },
            end: { x: 4, y: 5 },
            solution: 'D1, R1, D1, L1, D1, R1, D1, R3, U1, L2',
            imageLocation: { x: 0, y: 0 }
        },
        {
            start: { x: 2, y: 4 },
            end: { x: 5, y: 1 },
            solution: 'U2, R1, D1, R1, U1, R1, D1, R1, U2, L1',
            imageLocation: { x: -239, y: 0 }
        },
        {
            start: { x: 5, y: 1 },
            end: { x: 3, y: 5 },
            solution: 'R1, D1, L2, U1, L3, D5, R2, U1',
            imageLocation: { x: -478, y: 0 }
        },
        {
            start: { x: 6, y: 1 },
            end: { x: 5, y: 4 },
            solution: 'L1, D1, R1, D4, L4, U1, R2, U1, R1',
            imageLocation: { x: -717, y: 0 }
        },
        {
            start: { x: 3, y: 2 },
            end: { x: 4, y: 6 },
            solution: 'R1, U1, L1, U1, L1, U1, R1, u1, R2, U1, L3, D1',
            imageLocation: { x: -956, y: 0 }
        },
        {
            start: { x: 3, y: 2 },
            end: { x: 5, y: 5 },
            solution: 'L2, U1, R4, D1, R1, D3, L1',
            imageLocation: { x: -1195, y: 0 }
        },
        {
            start: { x: 3, y: 4 },
            end: { x: 2, y: 5 },
            solution: 'R1, U1, L2, U1, R1, U1, L2, D4, R1',
            imageLocation: { x: -1434, y: 0 }
        },
        {
            start: { x: 5, y: 5 },
            end: { x: 3, y: 3 },
            solution: 'L1, D1, L3, U3, R2',
            imageLocation: { x: -1673, y: 0 }
        },







        {
            start: { x: 5, y: 2 },
            end: { x: 1, y: 6 },
            solution: 'R1, U1, L5, D1, R2, D3, R1, U2, R1, D3',
            imageLocation: { x: 0, y: -239 }
        },
        {
            start: { x: 6, y: 5 },
            end: { x: 4, y: 4 },
            solution: 'U3, R1, D1, R2, D1, L1',
            imageLocation: { x: -239, y: -239 }
        },
        {
            start: { x: 1, y: 3 },
            end: { x: 4, y: 3 },
            solution: 'U2, R5, D2, L1, U1, R2, D2, L1, U1',
            imageLocation: { x: -478, y: -239 }
        },
        {
            start: { x: 6, y: 1 },
            end: { x: 1, y: 5 },
            solution: 'L1, D1, L2, U1, L1, D2, R2, D2, R3',
            imageLocation: { x: -717, y: -239 }
        },
        {
            start: { x: 2, y: 1 },
            end: { x: 4, y: 6 },
            solution: 'U3, L1, D1, L1, U2, L1, U1, R1',
            imageLocation: { x: -956, y: -239 }
        },
        {
            start: { x: 1, y: 3 },
            end: { x: 4, y: 3 },
            solution: 'U2, R5, D1, L1, U1, L2, D2, R1, U1',
            imageLocation: { x: -1195, y: -239 }
        },
        {
            start: { x: 2, y: 4 },
            end: { x: 3, y: 2 },
            solution: 'D1, R1, D1, R1, U1, R1, U1, R1, U1, L2, D1, L1, U1, L1, U1, R1',
            imageLocation: { x: -1434, y: -239 }
        },
        {
            start: { x: 5, y: 4 },
            end: { x: 2, y: 3 },
            solution: 'R1, D2, L4, U1, R1, U2, L1',
            imageLocation: { x: -1673, y: -239 }
        }
    ];


    self.dummy.notifySubscribers();
}

function iw_dlc4_initialize(container){
    var viewButton = new vmButtonStep();

    ko.cleanNode(document.getElementById("tabs1"));
    ko.applyBindings(viewButton, document.getElementById('tabs1'));

    var viewMaze = new vmMazeStep();
    ko.cleanNode(document.getElementById("tabs2"));
    ko.applyBindings(viewMaze, document.getElementById('tabs2'));
}