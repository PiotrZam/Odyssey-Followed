
var placeholdersArray = [];
var avatar = "images/avatar.jpg";
var followed = [];
// var imagesPerRow = Math.floor((window.innerWidth * 0.98 - 145) / 135);
var followedPerRow = 3;
var opened = false;
var animationTime = 0.7;
var toTranslate = null;


//function generating placeholder pictures for the followed person's dashboard
// For Testing only
function generatePlaceholders() {
    for (let i = 0; i <= 15; i++) {
        if (i < 7) {
            let placeholder = `./images/placeholder${i + 1}.jpg`;
            placeholdersArray.push(placeholder);
        } else {
            let placeholder = `./images/placeholder.png`;
            placeholdersArray.push(placeholder);
        }
    }
}

//Dynamically generating the followed people's sample profiles
// For Testing only, in reality we'd use a JSON file
function generateFollowed() {
    data.forEach((element) => {
        let followedPerson = {
            profileName: element.profileName,
            profileAvatar: element.profileAvatar,
            dashboard: element.dashboard,
            imagesDisplayed: 0,
            id: element.id
        };
        followed.push(followedPerson);
    });
}


// A function that dynamically creates HTML code for the followed people and appends it to 'main'
function displayFollowed() {
    $('main').append('<div class="followedWrapper"> </div>')


    let followedCount = 0;
    while (followedCount < followed.length) {
        let followedArticle;
        $('.followedWrapper').append('<div class="articleRow"></div>');
        try {
            for (let i = 0; i < followedPerRow; i++) {
                let element = followed[followedCount];
                followedArticle = `
                    <article class = "followed" id="f-${element.id}">
                        <div class="followedAvatar">
                            <img src=${element.profileAvatar}>
                            <div class="followedName">
                                <p>${element.profileName}</p>
                            </div>
                        </div>
                    </article>
                `;
                followedCount++;
                $('.articleRow').last().append(followedArticle);
            }
        } catch {
            break;
        }
    }
}

function loadMoreArtwork() {
    $('.openedDashboard').scroll(() => {
        let pane = $('.openedDashboard');
        let totalPaneHeight = $(pane).prop('scrollHeight');
        let paneHeight = $(pane).height();
        console.log("You're srolling!");
        console.log("Window height:" + window.innerHeight);
        console.log("scrollTop: " + $(pane).scrollTop());
        console.log("pane height: " + paneHeight);
        console.log("pane scroll height: " + totalPaneHeight);
        if ($(pane).scrollTop() + $(pane).height() >= totalPaneHeight - 1 * paneHeight) {
            console.log("Loading more!!!");
            createArtRows(1, followed[0]);
        }
    });
}



function showMoreEvent() {
    $('.followed').click((e) => {
        var theTarget = null;
        if (e.target.nodeName == 'IMG') {
            theTarget = e.target.parentNode.parentNode;
        } else {
            theTarget = e.target.parentNode.parentNode.parentNode;
        }
        let theWrapper = theTarget.parentNode;
        let siblings = $(theTarget).siblings();

        if (!opened) {
            opened = true;
            let targetIndex = parseInt($(theTarget).attr('id').split('-')[1]);
            console.log(targetIndex);
            console.log("e: " + e.target.nodeName);
            console.log("target: " + theTarget.nodeName);
            // let topPos = theTarget.offsetTop;
            // let y = window.scrollY;
            // let pxToScroll = topPos - y;
            // if (pxToScroll < 0) {
            //     pxToScroll = -pxToScroll;
            // }
            // console.log('offsetTop: ' + topPos);
            // console.log('window y: ' + y);

            $(theWrapper).after('<div class="openedWrapper" style="display: none"></div>');
            $('.openedWrapper').append('<div class="openedDashboard"></div>');
            createArtRows(2, followed[targetIndex - 1]);
            loadMoreArtwork();
            $('.openedWrapper').fadeIn(1100);
            // window.scrollBy(0, rect.top);

            var rect = theTarget.getBoundingClientRect();
            console.log("top: " + rect.top + ", right: " + rect.right + " , bottom: " + rect.bottom + ", left: " + rect.left + "");
            let windowMiddle = Math.floor(window.innerWidth / 2);
            console.log(windowMiddle);
            let avatarWidth = rect.right - rect.left;
            toTranslate = windowMiddle - (rect.left + (avatarWidth / 2));
            console.log("toTranslate: " + toTranslate);

            window.scrollBy({
                top: rect.top - 30,
                left: 0,
                behavior: 'smooth'
            });
            console.log("Scrolled by: " + (rect.top));

            $(siblings).delay(500).animate({ opacity: 0 }, 600);
            $(siblings).css('pointer-events', 'none');
            $('body').addClass('static');

            $(theTarget).addClass('active');
            $(theTarget).delay(1000).animate({ left: toTranslate }, 800, () => {
                let controls = $(theTarget).append(`
                    <div class="followedControls">
                        <i class="material-icons accountIcon">
                            person
                        </i>
                        <i class="material-icons expandIcon">
                            expand_more
                        </i>
                    </div>`);

                // $(theTarget.parentNode).css('visibility', 'hidden');
                $(theTarget).css('min-width', '350px');
            });

        } else {
            if ($(theTarget).hasClass('active')) {
                // $(theTarget).addClass('fadingOut');
                $('.openedWrapper').slideUp(700);
                setTimeout(() => {
                    $('.openedWrapper').remove();
                }, 800);

                $('.followedControls').fadeOut(500);
                $('.followedControls').remove();
                $(theTarget).css('min-width', '150px');
                $(theTarget).delay(10).animate({ left: '0px' }, 500, () => {

                    $(siblings).animate({ opacity: 1 }, 800);
                    setTimeout(() => {
                        $('.active').removeClass('active');
                        $('body').removeClass('static');
                        $(siblings).removeAttr('style');
                        opened = false;
                        theTarget = null;
                        toTranslate = null;
                    }, 800);
                });
            }
        }
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// TIBERIU'S CODE:

// Get Harvard API data
let page = 10;
function getHarvardAPIData(artCount, element) {
    let baseURL = 'https://api.harvardartmuseums.org/object/';
    let queryString = $.param({
        apikey: '3091eed3-5864-44ee-b761-b6e28cd10be6',
        fields: 'primaryimageurl,title,description,caption,date',
        classification: 'Paintings',
        size: 1000
    });

    // Get request by artcount
    $.ajax({
        dataType: 'JSON',
        url: (baseURL + '?' + queryString + '&page=' + page.toString()),
        success: function (result) {
            for (let x = 0; x < result.records.length; x++) {
                let link = result.records[x].primaryimageurl;
                let description = result.records[x].description;
                let caption = result.records[x].caption;
                let date = result.records[x].date;
                if (link != null && description != null) {
                    let record = {
                        'link': link,
                        'description': description
                    };
                    // Add caption
                    if (caption != null) {
                        record['caption'] = caption;
                    } else {
                        record['caption'] = 'Unknown';
                    }
                    // Add date
                    if (date != null) {
                        record['date'] = date;
                    } else {
                        record['date'] = 'Unknown';
                    }

                    if (record.link.length > 0) {
                        // TODO Add details to extension
                        element.css({
                            'background': 'url("' + record.link + '")',
                            'background-size': 'cover'
                        })
                        break;
                    }

                }
            }
        }
    }); // end ajax request
    page++;
}

// Patterns specifications 
const patterns = {
    'patternI': {
        'type': 'A',
        'amount': 6,
        'minHeight': [true, false, false, false, false, true],
        'poem': [false, true, false, false, false, true]
    },
    'patternII': {
        'type': 'B',
        'amount': 6,
        'minHeight': [true, false, false, false, false, true],
        'poem': [true, false, false, true, false, false]
    },
    'patternIII': {
        'type': 'C',
        'amount': 7,
        'minHeight': [false, false, true, true, true, false, false],
        'poem': [false, false, true, false, true, false]
    }
};

let totalArtworkCounter = 1;
// Create rows by cycling the patterns dictionary 
function createArtRows(amount, profile) {

    let startPoint;
    let curentPattern;
    while (amount > 0) {
        // Get the last pattern name or choose to start from the first one if none exist
        let lastPattern;

        try {
            lastPattern = $('.openedDashboard').children('.layoutSettings').last().attr('class').split(' ')[1];
        } catch {
            lastPattern = 'patternIII';
        }

        // Decide startPoint to avoid repeating the same pattern
        switch (lastPattern) {
            case 'patternI': startPoint = 1; break;
            case 'patternII': startPoint = 2; break;
            case 'patternIII': startPoint = 0; break;
        }
        let patternName = Object.keys(patterns)[startPoint];
        curentPattern = patterns[patternName];
        let rowArtCounter = 0;
        $('.openedDashboard').append('<div class="layoutSettings ' + patternName + '">');

        let currentRow = $('.layoutSettings').last();

        // Generate the each row depending on the current patern
        while (rowArtCounter < curentPattern.amount) {
            let container = currentRow.append('<div class="container ' + curentPattern.type + (rowArtCounter + 1).toString() + '">');
            $('.container').last().append('<div class="artwork" id="art-' + totalArtworkCounter.toString() + '">');

            // Insert poem or artwork depending on the design
            if (curentPattern.poem[rowArtCounter]) {
                let currentPoem = poems[rowArtCounter].lines;
                $('#art-' + totalArtworkCounter.toString()).append('<h1>Poem title</h1>');
                $('#art-' + totalArtworkCounter.toString()).append('<div class="poemLines">')
                currentPoem.forEach(function (line) {
                    $('.poemLines').append('<p>' + line + '</p>');
                })
            } else {
                // Call getHarvardAPIData to assign the artwork link
                // getHarvardAPIData(1, $('#art-' + totalArtworkCounter.toString()));
                $('#art-' + totalArtworkCounter.toString()).append(`<img src="${profile.dashboard[rowArtCounter]}"/>}`);

            }
            // Add min-height if required
            if (curentPattern.minHeight[rowArtCounter]) {
                $('#art-' + totalArtworkCounter.toString()).css('min-height', '61vh');
            }
            totalArtworkCounter++;
            rowArtCounter++;
        }
        amount--;
    }


}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(() => {
    generatePlaceholders();
    generateFollowed();
    displayFollowed();
    showMoreEvent();
    // expandImg();
    // console.log(followed[1].dashboard);
});


