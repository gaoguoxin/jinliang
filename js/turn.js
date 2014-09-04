//http://www.17sucai.com/pins/5338.html(本例源码)
//http://www.17sucai.com/pins/394.html(其他参考)
//http://www.mathieusavard.info/threesixty/demo.html(其他参考)

if (typeof(UIMIX) == 'undefined') UIMIX = {};
UIMIX.fullview = {
    data: {
        ready: false,
        dragging: false,
        pointerStartPosX: 0,
        scale: 1,
        fix_width: -1,
        fix_height: -1,
        max_width: -1,
        max_height: -1,
        monitorStartTime: 0,
        monitorInt: 10,
        ticker: 0,
        speedMultiplier: 10,
        spinner: false,
        container: false,
        pathPattern: false,
        totalFrames: 180,
        currentFrame: 0,
        frames: [],
        endFrame: -720,
        loadedImages: 0
    },
    relocate: function() {
        var w, h, l, t;
        if (UIMIX.fullview.data.fix_width > 0 && UIMIX.fullview.data.fix_height > 0) {
            l = Math.max(0, (w - UIMIX.fullview.data.fix_width) / 2);
            t = Math.max(0, (h - UIMIX.fullview.data.fix_height) / 2);
            w = UIMIX.fullview.data.fix_width;
            h = UIMIX.fullview.data.fix_height
        } else {
            w = UIMIX.fullview.data.max_width > 0 ? Math.min(UIMIX.fullview.data.max_width, $(window).width()) : $(window).width();
            h = UIMIX.fullview.data.max_height > 0 ? Math.min(UIMIX.fullview.data.max_height, $(window).height()) : $(window).height();
            if (w / h > UIMIX.fullview.data.scale) {
                w = h * UIMIX.fullview.data.scale
            } else {
                h = w / UIMIX.fullview.data.scale
            }
            l = ($(window).width() - w) / 2;
            t = ($(window).height() - h) / 2
        }
        UIMIX.fullview.data.container.css({
            width: w,
            height: h,
            marginTop: t,
            marginLeft: l
        })
    },
    imageLoaded: function(img) {
        var li = $('<li></li>');
        var image = $('<img>').attr('src', img.src).addClass("previous-image").appendTo(li);
        UIMIX.fullview.data.frames.push(image);
        UIMIX.fullview.data.container.children('ol').append(li);
        UIMIX.fullview.data.loadedImages++;
        UIMIX.fullview.data.container.find('em.loading p').text(Math.floor(UIMIX.fullview.data.loadedImages / UIMIX.fullview.data.totalFrames * 100) + "%");
        if (UIMIX.fullview.data.loadedImages == UIMIX.fullview.data.totalFrames) {
            UIMIX.fullview.start()
        } else {
            UIMIX.fullview.loadImage()
        }
    },
    loadImage: function(force) {
        var imageName = UIMIX.fullview.data.pathPattern.replace('#index#', UIMIX.fullview.data.loadedImages + 1);
        if (force) imageName += "?" + new Date().getTime();
        var img = new Image();
        img.src = imageName;
        if (img.complete) {
            UIMIX.fullview.imageLoaded(img);
            return
        }
        $(img).load(function() {
            UIMIX.fullview.imageLoaded(img)
        }).error(function() {
            if (force) {
                UIMIX.fullview.data.container.html('<div style="text-align:center;margin-top:50%;">加载失败，<a href="' + location.href + '">请重试</a></div>')
            } else {
                UIMIX.fullview.loadImage(true)
            }
        })
    },
    start: function() {
        UIMIX.fullview.data.frames[0].removeClass("previous-image").addClass("current-image");
        UIMIX.fullview.data.container.children("em.loading").fadeOut("slow",
        function() {
            UIMIX.fullview.data.container.children("em.loading").remove();
            UIMIX.fullview.data.container.children('ol').fadeIn("slow");
            UIMIX.fullview.data.ready = true;
            UIMIX.fullview.refresh()
        })
    },
    init: function() {
        UIMIX.fullview.data.container = $('#threesixty');
        UIMIX.fullview.data.container.on({
            mousedown: function() {
                $("body").addClass("drag")
            },
            mouseup: function() {
                $("body").removeClass("drag")
            }
        });
        if (UIMIX.fullview.data.container.attr('image_count')) {
            UIMIX.fullview.data.totalFrames = parseInt(UIMIX.fullview.data.container.attr('image_count'))
        }
        if (UIMIX.fullview.data.container.attr('end_frame')) {
            UIMIX.fullview.data.endFrame = parseInt(UIMIX.fullview.data.container.attr('end_frame'))
        }
        if (UIMIX.fullview.data.container.attr('scale')) {
            UIMIX.fullview.data.scale = parseInt(UIMIX.fullview.data.container.attr('scale'))
        }
        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            if (UIMIX.fullview.data.container.attr('fix_width')) {
                UIMIX.fullview.data.fix_width = parseInt(UIMIX.fullview.data.container.attr('fix_width'))
            }
            if (UIMIX.fullview.data.container.attr('fix_height')) {
                UIMIX.fullview.data.fix_height = parseInt(UIMIX.fullview.data.container.attr('fix_height'))
            }
        }
        if (UIMIX.fullview.data.container.attr('max_width')) {
            UIMIX.fullview.data.max_width = parseInt(UIMIX.fullview.data.container.attr('max_width'))
        }
        if (UIMIX.fullview.data.container.attr('max_height')) {
            UIMIX.fullview.data.max_height = parseInt(UIMIX.fullview.data.container.attr('max_height'))
        }
        $(window).resize(UIMIX.fullview.relocate);
        UIMIX.fullview.relocate();
        UIMIX.fullview.data.pathPattern = UIMIX.fullview.data.container.attr('path_pattern');
        try {
            UIMIX.fullview.data.spinner = new CanvasLoader('loading');
            UIMIX.fullview.data.spinner.setShape("spiral");
            UIMIX.fullview.data.spinner.setDiameter(80);
            UIMIX.fullview.data.spinner.setDensity(80);
            UIMIX.fullview.data.spinner.setRange(1);
            UIMIX.fullview.data.spinner.setSpeed(4);
            UIMIX.fullview.data.spinner.setColor("#008cd6");
            UIMIX.fullview.data.spinner.show()
        } catch(e) {
            UIMIX.fullview.data.spinner = $("#spinner")
        }
        UIMIX.fullview.data.container.children("em.loading").fadeIn("slow");
        UIMIX.fullview.loadImage();
        $(document).mousedown(function(event) {
            event.preventDefault();
            pointerStartPosX = UIMIX.fullview.getPointerEvent(event).pageX;
            UIMIX.fullview.data.dragging = true
        }).mouseup(function(event) {
            event.preventDefault();
            UIMIX.fullview.data.dragging = false
        }).mousemove(function(event) {
            event.preventDefault();
            UIMIX.fullview.trackPointer(event)
        }).live("touchstart",
        function(event) {
            event.preventDefault();
            pointerStartPosX = UIMIX.fullview.getPointerEvent(event).pageX;
            UIMIX.fullview.data.dragging = true
        }).live("touchmove",
        function(event) {
            event.preventDefault();
            UIMIX.fullview.trackPointer(event)
        }).live("touchend",
        function(event) {
            event.preventDefault();
            UIMIX.fullview.data.dragging = false
        })
    },
    render: function() {
        if (UIMIX.fullview.data.currentFrame !== UIMIX.fullview.data.endFrame) {
            var frameEasing = UIMIX.fullview.data.endFrame < UIMIX.fullview.data.currentFrame ? Math.floor((UIMIX.fullview.data.endFrame - UIMIX.fullview.data.currentFrame) * 0.1) : Math.ceil((UIMIX.fullview.data.endFrame - UIMIX.fullview.data.currentFrame) * 0.1);
            UIMIX.fullview.data.frames[UIMIX.fullview.getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image");
            UIMIX.fullview.data.currentFrame += frameEasing;
            UIMIX.fullview.data.frames[UIMIX.fullview.getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image")
        } else {
            window.clearInterval(UIMIX.fullview.data.ticker);
            UIMIX.fullview.data.ticker = 0
        }
    },
    refresh: function() {
        if (UIMIX.fullview.data.ticker === 0) {
            UIMIX.fullview.data.ticker = setInterval(UIMIX.fullview.render, Math.round(1000 / 60))
        }
    },
    getNormalizedCurrentFrame: function() {
        var c = -Math.ceil(UIMIX.fullview.data.currentFrame % UIMIX.fullview.data.totalFrames);
        if (c < 0) c += (UIMIX.fullview.data.totalFrames - 1);
        return c
    },
    getPointerEvent: function(event) {
        return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event
    },
    trackPointer: function(event) {
        if (!UIMIX.fullview.data.ready || !UIMIX.fullview.data.dragging) return;
        var x = UIMIX.fullview.getPointerEvent(event).pageX;
        if (UIMIX.fullview.data.monitorStartTime < new Date().getTime() - UIMIX.fullview.data.monitorInt) {
            var dis = x - UIMIX.fullview.data.pointerStartPosX;
            UIMIX.fullview.data.endFrame = UIMIX.fullview.data.currentFrame + Math.ceil((UIMIX.fullview.data.totalFrames - 1) * UIMIX.fullview.data.speedMultiplier * (dis / UIMIX.fullview.data.container.width()));
            UIMIX.fullview.refresh();
            UIMIX.fullview.data.monitorStartTime = new Date().getTime();
            UIMIX.fullview.data.pointerStartPosX = x
        }
    }
};
$(document).ready(UIMIX.fullview.init);