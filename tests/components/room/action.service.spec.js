'use strict';

describe('ActionService', function () {
  var ActionService, $timeout, $rootScope;

  // Only loading one module which is being tested
  beforeEach(module('janusHangouts.actionService'));

  // Define Spies
  var FeedsServiceSpy, FeedSpy, LogEntrySpy, LogServiceSpy, DataChannelServiceSpy,
      feedDisconnnectSpy, feedIgnoreSpy, feedStopIgnoringSpy, feedSetEnabledChannel,
      entryHasTextSpy;

  beforeEach(function () {
    feedDisconnnectSpy = jasmine.createSpy('feed.disconnect');
    feedIgnoreSpy = jasmine.createSpy('feed.ignore');
    feedStopIgnoringSpy = jasmine.createSpy('feed.stopIgnoring');
    feedSetEnabledChannel = jasmine.createSpy('feed.setEnabledChannel');

    entryHasTextSpy = jasmine.createSpy('entry.hasText');

    FeedsServiceSpy = {
      add: jasmine.createSpy('FeedsService.add'),
      allFeeds: jasmine.createSpy('FeedsService.allFeeds').and.callFake(function () {
        var feeds = [
          { id: 1},
          { id: 2},
          { id: 3},
          { id: 4},
          { id: 5}
        ];
        return feeds;
      }),
      find: jasmine.createSpy('FeedsService.find').and.callFake(function (feedId) {
        return {
          id: feedId,
          disconnect: feedDisconnnectSpy,
          ignore: feedIgnoreSpy,
          stopIgnoring: feedStopIgnoringSpy
        };
      }),
      destroy: jasmine.createSpy('FeedsService.destroy'),
      findMain: jasmine.createSpy('FeesService.findMain')
    };

    FeedSpy = jasmine.createSpy('Feed').and.callFake(function () {
      this.fakeFeed = true;
    });

    LogEntrySpy = jasmine.createSpy('LogEntry').and.callFake(function () {
      this.fakeLogEntry = true;
      this.hasText = entryHasTextSpy;
    });

    LogServiceSpy = {
      add: jasmine.createSpy('LogService')
    };

    DataChannelServiceSpy = {
      sendChatMessage: jasmine.createSpy('DataChannelService.sendChatMessage')
    };
  });

  // Mock External modules
  beforeEach(function () {
    module(function($provide) {
      $provide.value('Feed', FeedSpy);
      $provide.value('FeedsService', FeedsServiceSpy);
      $provide.value('LogEntry', LogEntrySpy);
      $provide.value('LogService', LogServiceSpy);
      $provide.value('DataChannelService', DataChannelServiceSpy);
    })

  });


  beforeEach(inject(function (_ActionService_, _$timeout_, _$rootScope_) {
    ActionService = _ActionService_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    FeedsServiceSpy.add.calls.reset();
    FeedsServiceSpy.find.calls.reset();
    FeedsServiceSpy.allFeeds.calls.reset();
    FeedSpy.calls.reset();
    LogEntrySpy.calls.reset();
    LogServiceSpy.add.calls.reset();
  });

  it('should define functions', function () {
    expect(ActionService.enterRoom).toBeFunction();
    expect(ActionService.leaveRoom).toBeFunction();
    expect(ActionService.remoteJoin).toBeFunction();
    expect(ActionService.destroyFeed).toBeFunction();
    expect(ActionService.ignoreFeed).toBeFunction();
    expect(ActionService.stopIgnoringFeed).toBeFunction();
    expect(ActionService.writeChatMessage).toBeFunction();
    expect(ActionService.publishScreen).toBeFunction();
    expect(ActionService.toggleChannel).toBeFunction();
    expect(ActionService.setMedia).toBeFunction();
  });


  // Test enterRoom method
  describe('enterRoom', function () {
    var feedId = 1,
        display = 'd',
        connection = 'conn';

    it('should call Feed',function () {

      ActionService.enterRoom(feedId, display, connection);

      expect(FeedSpy).toHaveBeenCalledWith({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: true
      });
    });

    it('should call FeedsService.add',function () {
      ActionService.enterRoom(feedId, display, connection);

      expect(FeedsServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeFeed: true}),
        jasmine.objectContaining({main: true})
      );
    });

  });
  // End enterRoom method

  // Test leaveRoom method
  describe('leaveRoom', function () {

    it('should call FeedsService.allFeeds',function () {
      spyOn(ActionService, 'destroyFeed');
      ActionService.leaveRoom();

      expect(FeedsServiceSpy.allFeeds).toHaveBeenCalled();
    });

    it('should call ActionService.destroyFeed for each returned feed',function () {
      spyOn(ActionService, 'destroyFeed');
      ActionService.leaveRoom();

      var feeds = FeedsServiceSpy.allFeeds();
      expect(ActionService.destroyFeed.calls.count()).toBe(feeds.length);
    });


  });
  // End leaveRoom method

  // Test publishScreen method
  describe('publishScreen', function () {
    var feedId = 1,
        display = 'd',
        connection = 'conn';

    it('should call Feed',function () {

      ActionService.publishScreen(feedId, display, connection);

      expect(FeedSpy).toHaveBeenCalledWith({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: true,
        isLocalScreen: true
      });
    });

    it('should call FeedsService.add',function () {
      ActionService.publishScreen(feedId, display, connection);

      expect(FeedsServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeFeed: true})
      );
    });

    it('should call LogEntry', function () {
      ActionService.publishScreen(feedId, display, connection);

      expect(LogEntrySpy).toHaveBeenCalledWith('publishScreen');
    });

    it('should call LogService.add', function () {
      ActionService.publishScreen(feedId, display, connection);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });
  });
  // End publishScreen method

  // Test remoteJoin method
  describe('remoteJoin', function () {
    var feedId = 1,
        display = 'd',
        connection = 'conn';

    it('should call Feed',function () {

      ActionService.remoteJoin(feedId, display, connection);

      expect(FeedSpy).toHaveBeenCalledWith({
        display: display,
        connection: connection,
        id: feedId,
        isPublisher: false,
      });
    });

    it('should call FeedsService.add',function () {
      ActionService.remoteJoin(feedId, display, connection);

      expect(FeedsServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeFeed: true})
      );
    });

    it('should call LogEntry', function () {
      ActionService.remoteJoin(feedId, display, connection);

      expect(LogEntrySpy).toHaveBeenCalledWith(
        'newRemoteFeed',
        jasmine.objectContaining(
          {
            feed: jasmine.objectContaining(
              {fakeFeed: true}
            )
          }
        )
      );
    });

    it('should call LogService.add', function () {
      ActionService.remoteJoin(feedId, display, connection);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });
  });
  // End remoteJoin method

  // Test destroyFeed method
  describe('destroyFeed', function () {
    var feedId = 1;

    it('should call FeedsService.add',function () {
      ActionService.destroyFeed(feedId);

      expect(FeedsServiceSpy.find).toHaveBeenCalledWith(feedId);
    });

    it('should not call LogEntry when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.destroyFeed(feedId);

      expect(LogEntrySpy).not.toHaveBeenCalled();
    });

    it('should not call LogService.add when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.destroyFeed(feedId);

      expect(LogServiceSpy.add).not.toHaveBeenCalled();
    });


    it('should call LogEntry', function () {
      ActionService.destroyFeed(feedId);

      expect(LogEntrySpy).toHaveBeenCalledWith(
        'destroyFeed',
        jasmine.objectContaining(
          {
            feed: jasmine.objectContaining(
              {id: feedId}
            )
          }
        )
      );
    });

    it('should call LogService.add', function () {
      ActionService.destroyFeed(feedId);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });

    it('should call feed.disconnect', function () {
      ActionService.destroyFeed(feedId);
      $timeout.flush();

      expect(feedDisconnnectSpy).toHaveBeenCalled();
    });

    it('should call FeedsService.destroy', function () {
      ActionService.destroyFeed(feedId);
      $timeout.flush();

      expect(FeedsServiceSpy.destroy).toHaveBeenCalled();
    });
  });
  // End destroyFeed method

  // Test ignoreFeed method
  describe('ignoreFeed', function () {
    var feedId = 1;

    it('should call FeedsService.add',function () {
      ActionService.ignoreFeed(feedId);

      expect(FeedsServiceSpy.find).toHaveBeenCalledWith(feedId);
    });

    it('should not call LogEntry when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.ignoreFeed(feedId);

      expect(LogEntrySpy).not.toHaveBeenCalled();
    });

    it('should not call LogService.add when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.ignoreFeed(feedId);

      expect(LogServiceSpy.add).not.toHaveBeenCalled();
    });


    it('should call LogEntry', function () {
      ActionService.ignoreFeed(feedId);

      expect(LogEntrySpy).toHaveBeenCalledWith(
        'ignoreFeed',
        jasmine.objectContaining(
          {
            feed: jasmine.objectContaining(
              {id: feedId}
            )
          }
        )
      );
    });

    it('should call LogService.add', function () {
      ActionService.ignoreFeed(feedId);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });

  });
  // End ignoreFeed method

  // Test stopIgnoringFeed method
  describe('stopIgnoringFeed', function () {
    var feedId = 1;

    it('should call FeedsService.add',function () {
      ActionService.stopIgnoringFeed(feedId);

      expect(FeedsServiceSpy.find).toHaveBeenCalledWith(feedId);
    });

    it('should not call LogEntry when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.stopIgnoringFeed(feedId);

      expect(LogEntrySpy).not.toHaveBeenCalled();
    });

    it('should not call LogService.add when feed not found', function () {
      FeedsServiceSpy.find.and.returnValue(null);
      ActionService.stopIgnoringFeed(feedId);

      expect(LogServiceSpy.add).not.toHaveBeenCalled();
    });


    it('should call LogEntry', function () {
      ActionService.stopIgnoringFeed(feedId);

      expect(LogEntrySpy).toHaveBeenCalledWith(
        'stopIgnoringFeed',
        jasmine.objectContaining(
          {
            feed: jasmine.objectContaining(
              {id: feedId}
            )
          }
        )
      );
    });

    it('should call LogService.add', function () {
      ActionService.stopIgnoringFeed(feedId);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });

  });
  // End stopIgnoringFeed method

  // Test writeChatMessage method
  describe('writeChatMessage', function () {
    var text = 'random text';

    it('should call LogEntry', function () {
      ActionService.writeChatMessage(text);

      expect(LogEntrySpy).toHaveBeenCalledWith(
        'chatMsg',
        jasmine.objectContaining(
          {
            text: text
          }
        )
      );
    });

    it('should call FeedsService.findMain', function () {
      ActionService.writeChatMessage(text);

      expect(FeedsServiceSpy.findMain).toHaveBeenCalled();
    });


    it('should call LogService.add', function () {
      entryHasTextSpy.and.returnValue(true);
      ActionService.writeChatMessage(text);

      expect(LogServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({fakeLogEntry: true})
      );
    });

    it('should call DataChannelService.sendChatMessage', function () {
      entryHasTextSpy.and.returnValue(true);
      ActionService.writeChatMessage(text);

      expect(DataChannelServiceSpy.sendChatMessage).toHaveBeenCalledWith(text);
    });

    it('should not call LogService.add when entry has not text', function () {
      entryHasTextSpy.and.returnValue(false);
      ActionService.writeChatMessage(text);

      expect(LogServiceSpy.add).not.toHaveBeenCalled();
    });

    it('should not call DataChannelService.sendChatMessage when entry has not text', function () {
      entryHasTextSpy.and.returnValue(false);
      ActionService.writeChatMessage(text);

      expect(DataChannelServiceSpy.sendChatMessage).not.toHaveBeenCalled();
    });

  });
  // End writeChatMessage method

  // Test toggleChannel method
  describe('toggleChannel', function () {
    var type = 1;

    describe('when feed is undefined', function () {
      var feed = undefined,
          mainFeed;

      beforeEach(function () {
        mainFeed = {
          id: 1,
          isPublisher: true,
          isEnabled: jasmine.createSpy('feed.isEnabled'),
          setEnabledChannel: jasmine.createSpy('feed.setEnabledChannel')
        };
      });

      it('should call FeedsService.findMain', function () {
        ActionService.toggleChannel(type, feed);

        expect(FeedsServiceSpy.findMain).toHaveBeenCalled();
      });

      it('should not call feed.isEnabled when FeedsService.findMain return undefined', function () {
        FeedsServiceSpy.findMain.and.returnValue(undefined);
        ActionService.toggleChannel(type, feed);

        expect(mainFeed.isEnabled).not.toHaveBeenCalled();
      });

      it('should call feed.isEnabled', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        ActionService.toggleChannel(type, feed);

        expect(mainFeed.isEnabled).toHaveBeenCalledWith(type);
      });

      it('should not call LogEntry if feed is publisher', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        ActionService.toggleChannel(type, feed);

        expect(LogEntrySpy).not.toHaveBeenCalled();

      });

      it('should call LogEntry if feed isnt publisher', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isPublisher = false;
        ActionService.toggleChannel(type, feed);

        expect(LogEntrySpy).toHaveBeenCalledWith(
          'muteRequest',
          jasmine.objectContaining({
            source: mainFeed,
            target: mainFeed
          })
        );
      });

      it('should call FeedsService.findMain if feed isnt publisher', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isPublisher = false;
        ActionService.toggleChannel(type, feed);

        expect(FeedsServiceSpy.findMain).toHaveBeenCalled();
      });

      it('should call LogService.add if feed isnt publisher', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isPublisher = false;
        ActionService.toggleChannel(type, feed);

        expect(LogServiceSpy.add).toHaveBeenCalledWith(
          jasmine.objectContaining({fakeLogEntry: true})
        );
      });

      it('should call feed.setEnabledChannel when feed isnt enabled', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        ActionService.toggleChannel(type, feed);

        expect(mainFeed.setEnabledChannel).toHaveBeenCalledWith(type, true);
      });

      it('should call feed.setEnabledChannel when feed is enabled', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isEnabled.and.returnValue(true);
        ActionService.toggleChannel(type, feed);

        expect(mainFeed.setEnabledChannel).toHaveBeenCalledWith(
          type,
          false,
          jasmine.objectContaining({after: jasmine.any(Object)})
        );
      });

      it('should call feed.setEnabledChannel with callback when feed is enabled and type audio', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isEnabled.and.returnValue(true);
        ActionService.toggleChannel('audio', feed);

        expect(mainFeed.setEnabledChannel).toHaveBeenCalledWith(
          'audio',
          false,
          jasmine.objectContaining({after: jasmine.any(Function)})
        );
      });

      it('should call feed.setEnabledChannel without callback when feed is enabled, type audio and isnt publisher', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isEnabled.and.returnValue(true);
        mainFeed.isPublisher = false;
        ActionService.toggleChannel('audio', feed);

        expect(mainFeed.setEnabledChannel).toHaveBeenCalledWith(
          'audio',
          false,
          jasmine.objectContaining({after: jasmine.any(Object)})
        );
      });

      it('should call $rootScope.$broadcast when call callback', function () {
        FeedsServiceSpy.findMain.and.returnValue(mainFeed);
        mainFeed.isEnabled.and.returnValue(true);
        mainFeed.setEnabledChannel.and.callFake(function (type, boolval, cb) {
          cb.after();
        });
        spyOn($rootScope, '$broadcast');
        ActionService.toggleChannel('audio', feed);

        expect($rootScope.$broadcast).toHaveBeenCalledWith('muted.byUser');

      });

    });

    describe('when feed isnt undefined', function () {
      var feed;
      beforeEach(function () {
        feed = {
          id: 1,
          isPublisher: true,
          isEnabled: jasmine.createSpy('feed.isEnabled'),
          setEnabledChannel: jasmine.createSpy('feed.setEnabledChannel')
        };
      });

      it('should not call FeedsService.findMain', function () {
        ActionService.toggleChannel(type, feed);

        expect(FeedsServiceSpy.findMain).not.toHaveBeenCalled();
      });
    });


  });
  // End toggleChannel method

  // Test setMedia method
  describe('setMedia', function () {
    var type = 1,
        boolval = true;

    it('should call FeedsService.findMain', function () {
      ActionService.setMedia(type, boolval);

      expect(FeedsServiceSpy.findMain).toHaveBeenCalled();
    });

    it('should call feed.setEnabledChannel', function () {
      FeedsServiceSpy.findMain.and.returnValue({
        setEnabledChannel: feedSetEnabledChannel
      });
      ActionService.setMedia(type, boolval);

      expect(feedSetEnabledChannel).toHaveBeenCalledWith(type, boolval);
    });

    it('should not call feed.setEnabledChannel FeedsService.findMain return undefined', function () {
      FeedsServiceSpy.findMain.and.returnValue(undefined);
      ActionService.setMedia(type, boolval);

      expect(feedSetEnabledChannel).not.toHaveBeenCalled();
    });


  });
  // End setMedia method


});
