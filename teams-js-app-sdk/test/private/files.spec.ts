import { files } from '../../src/private/files';
import { Utils } from '../utils';
import { app } from '../../src/public/app';
import { FileOpenPreference } from '../../src/public/interfaces';
import { ViewerActionTypes } from '../../src/private/interfaces';

describe('files', () => {
  const utils = new Utils();
  const emptyCallback = () => {};

  beforeEach(() => {
    utils.processMessage = null;
    utils.messages = [];
    utils.childMessages = [];
    utils.childWindow.closed = false;
    utils.mockWindow.parent = utils.parentWindow;

    // Set a mock window for testing
    app._initialize(utils.mockWindow);
  });

  afterEach(() => {
    // Reset the object since it's a singleton
    if (app._uninitialize) {
      app._uninitialize();
    }
  });

  describe('getCloudStorageFolders', () => {
    it('should not allow calls before initialization', () => {
      expect(() => files.getCloudStorageFolders('channelId', emptyCallback)).toThrowError(
        'The library has not yet been initialized',
      );
    });

    it('should not allow calls without frame context initialization', async () => {
      await utils.initializeWithContext('settings');
      expect(() => files.getCloudStorageFolders('channelId', emptyCallback)).toThrowError(
        "This call is not allowed in the 'settings' context",
      );
    });

    it('should not allow calls with null channelId', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.getCloudStorageFolders(null, emptyCallback)).toThrowError();
    });

    it('should not allow calls with empty callback', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.getCloudStorageFolders('channelId', null)).toThrowError();
    });

    it('should trigger callback correctly', async () => {
      await utils.initializeWithContext('content');
      const mockCloudStorageFolders: files.CloudStorageFolder[] = [
        {
          id: 'id',
          title: 'folder title',
          folderId: 'folderId',
          providerType: files.CloudStorageProviderType.WopiIntegration,
          providerCode: files.CloudStorageProvider.Box,
          ownerDisplayName: 'owner',
        },
      ];

      const callback = jest.fn((err, folders) => {
        expect(err).toBeFalsy();
        expect(folders).toEqual(mockCloudStorageFolders);
      });

      files.getCloudStorageFolders('channelId', callback);

      const getCloudStorageFoldersMessage = utils.findMessageByFunc('files.getCloudStorageFolders');
      expect(getCloudStorageFoldersMessage).not.toBeNull();
      utils.respondToMessage(getCloudStorageFoldersMessage, false, mockCloudStorageFolders);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('addCloudStorageFolder', () => {
    it('should not allow calls before initialization', () => {
      expect(() => files.addCloudStorageFolder('channelId', emptyCallback)).toThrowError(
        'The library has not yet been initialized',
      );
    });

    it('should not allow calls without frame context initialization', async () => {
      await utils.initializeWithContext('settings');
      expect(() => files.addCloudStorageFolder('channelId', emptyCallback)).toThrowError(
        "This call is not allowed in the 'settings' context",
      );
    });

    it('should not allow calls with null channelId', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.addCloudStorageFolder(null, emptyCallback)).toThrowError();
    });

    it('should not allow calls with empty callback', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.addCloudStorageFolder('channelId', null)).toThrowError();
    });

    it('should trigger callback correctly', async () => {
      await utils.initializeWithContext('content');
      const mockCloudStorageFolders: files.CloudStorageFolder[] = [
        {
          id: 'id',
          title: 'folder title',
          folderId: 'folderId',
          providerType: files.CloudStorageProviderType.WopiIntegration,
          providerCode: files.CloudStorageProvider.Box,
          ownerDisplayName: 'owner',
        },
      ];

      const callback = jest.fn((err, isFolderAdded, folders) => {
        expect(err).toBeFalsy();
        expect(isFolderAdded).toEqual(true);
        expect(folders).toEqual(mockCloudStorageFolders);
      });

      files.addCloudStorageFolder('channelId', callback);

      const addCloudStorageFolderMessage = utils.findMessageByFunc('files.addCloudStorageFolder');
      expect(addCloudStorageFolderMessage).not.toBeNull();
      utils.respondToMessage(addCloudStorageFolderMessage, false, true, mockCloudStorageFolders);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('deleteCloudStorageFolder', () => {
    const mockCloudStorageFolder: files.CloudStorageFolder = {
      id: 'id',
      title: 'folder title',
      folderId: 'folderId',
      providerType: files.CloudStorageProviderType.WopiIntegration,
      providerCode: files.CloudStorageProvider.Box,
      ownerDisplayName: 'owner',
    };

    it('should not allow calls before initialization', () => {
      expect(() => files.deleteCloudStorageFolder('channelId', mockCloudStorageFolder, emptyCallback)).toThrowError(
        'The library has not yet been initialized',
      );
    });

    it('should not allow calls without frame context initialization', async () => {
      await utils.initializeWithContext('settings');
      expect(() => files.deleteCloudStorageFolder('channelId', mockCloudStorageFolder, emptyCallback)).toThrowError(
        "This call is not allowed in the 'settings' context",
      );
    });

    it('should not allow calls with null channelId', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.deleteCloudStorageFolder(null, mockCloudStorageFolder, emptyCallback)).toThrowError();
    });

    it('should not allow calls with null folderToDelete', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.deleteCloudStorageFolder('channelId', null, emptyCallback)).toThrowError();
    });

    it('should not allow calls with empty callback', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.deleteCloudStorageFolder('channelId', mockCloudStorageFolder, null)).toThrowError();
    });

    it('should trigger callback correctly', async () => {
      await utils.initializeWithContext('content');

      const callback = jest.fn((err, isFolderDeleted) => {
        expect(err).toBeFalsy();
        expect(isFolderDeleted).toEqual(true);
      });

      files.deleteCloudStorageFolder('channelId', mockCloudStorageFolder, callback);

      const deleteCloudStorageFolderMessage = utils.findMessageByFunc('files.deleteCloudStorageFolder');
      expect(deleteCloudStorageFolderMessage).not.toBeNull();
      utils.respondToMessage(deleteCloudStorageFolderMessage, false, true);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getCloudStorageFolderContents', () => {
    const mockCloudStorageFolder: files.CloudStorageFolder = {
      id: 'id',
      title: 'folder title',
      folderId: 'folderId',
      providerType: files.CloudStorageProviderType.WopiIntegration,
      providerCode: files.CloudStorageProvider.Box,
      ownerDisplayName: 'owner',
    };

    const mockCloudStorageFolderItems: files.CloudStorageFolderItem[] = [
      {
        id: 'test2',
        title: 'test2.pptx',
        isSubdirectory: false,
        type: '.pptx',
        size: 100,
        objectUrl: 'https://api.com/test2.pptx',
        lastModifiedTime: '2021-04-14T15:08:35Z',
      },
      {
        id: 'test3',
        title: 'test3.pptx',
        isSubdirectory: false,
        type: '.pptx',
        size: 100,
        objectUrl: 'https://api.com/test3.pptx',
        lastModifiedTime: '2021-04-14T15:08:35Z',
      },
    ];

    it('should not allow calls before initialization', () => {
      expect(() =>
        files.getCloudStorageFolderContents(mockCloudStorageFolder, files.CloudStorageProvider.Box, emptyCallback),
      ).toThrowError('The library has not yet been initialized');
    });

    it('should not allow calls without frame context initialization', async () => {
      await utils.initializeWithContext('settings');
      expect(() =>
        files.getCloudStorageFolderContents(mockCloudStorageFolder, files.CloudStorageProvider.Box, emptyCallback),
      ).toThrowError("This call is not allowed in the 'settings' context");
    });

    it('should not allow calls with null folder', async () => {
      await utils.initializeWithContext('content');
      expect(() =>
        files.getCloudStorageFolderContents(null, files.CloudStorageProvider.Box, emptyCallback),
      ).toThrowError();
    });

    it('should not allow calls for a file item', async () => {
      await utils.initializeWithContext('content');
      const mockFileItem = mockCloudStorageFolderItems[0];
      expect(() =>
        files.getCloudStorageFolderContents(mockFileItem, files.CloudStorageProvider.Box, emptyCallback),
      ).toThrowError();
    });

    it('should not allow calls without providerCode', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.getCloudStorageFolderContents(mockCloudStorageFolder, null, emptyCallback)).toThrowError();
    });

    it('should not allow calls with empty callback', async () => {
      await utils.initializeWithContext('content');
      expect(() =>
        files.getCloudStorageFolderContents(mockCloudStorageFolder, files.CloudStorageProvider.Box, null),
      ).toThrowError();
    });

    it('should trigger callback correctly for cloud storage folder', async () => {
      await utils.initializeWithContext('content');

      const callback = jest.fn((err, contents) => {
        expect(err).toBeFalsy();
        expect(contents).toEqual(mockCloudStorageFolderItems);
      });

      files.getCloudStorageFolderContents(mockCloudStorageFolder, files.CloudStorageProvider.Box, callback);

      const getCloudStorageFolderContentsMessage = utils.findMessageByFunc('files.getCloudStorageFolderContents');
      expect(getCloudStorageFolderContentsMessage).not.toBeNull();
      utils.respondToMessage(getCloudStorageFolderContentsMessage, false, mockCloudStorageFolderItems);
      expect(callback).toHaveBeenCalled();
    });

    it('should trigger callback correctly for cloud storage item', async () => {
      await utils.initializeWithContext('content');

      const callback = jest.fn((err, isFolderDeleted) => {
        expect(err).toBeFalsy();
        expect(isFolderDeleted).toEqual(mockCloudStorageFolderItems);
      });

      const mockCloudStorageFolderItem: files.CloudStorageFolderItem = {
        id: 'test1',
        title: 'test',
        isSubdirectory: true,
        type: '',
        size: 100,
        objectUrl: 'https://api.com/test',
        lastModifiedTime: '2021-04-14T15:08:35Z',
      };
      files.getCloudStorageFolderContents(mockCloudStorageFolderItem, files.CloudStorageProvider.Box, callback);

      const getCloudStorageFolderContentsMessage = utils.findMessageByFunc('files.getCloudStorageFolderContents');
      expect(getCloudStorageFolderContentsMessage).not.toBeNull();
      utils.respondToMessage(getCloudStorageFolderContentsMessage, false, mockCloudStorageFolderItems);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('openCloudStorageFile', () => {
    const mockCloudStorageFolderItem: files.CloudStorageFolderItem = {
      id: 'test1',
      title: 'test.pptx',
      isSubdirectory: false,
      type: '.pptx',
      size: 100,
      objectUrl: 'https://api.com/test.pptx',
      lastModifiedTime: '2021-04-14T15:08:35Z',
    };

    it('should not allow calls before initialization', () => {
      expect(() => files.openCloudStorageFile(mockCloudStorageFolderItem, files.CloudStorageProvider.Box)).toThrowError(
        'The library has not yet been initialized',
      );
    });

    it('should not allow calls without frame context initialization', async () => {
      await utils.initializeWithContext('settings');
      expect(() => files.openCloudStorageFile(mockCloudStorageFolderItem, files.CloudStorageProvider.Box)).toThrowError(
        "This call is not allowed in the 'settings' context",
      );
    });

    it('should not allow calls without file', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.openCloudStorageFile(null, files.CloudStorageProvider.Box)).toThrowError();
    });

    it('should not allow calls without providerCode', async () => {
      await utils.initializeWithContext('content');
      expect(() => files.openCloudStorageFile(mockCloudStorageFolderItem, null)).toThrowError();
    });

    it('should not allow calls for folder items', async () => {
      await utils.initializeWithContext('content');
      const mockFolderCloudStorageItem: files.CloudStorageFolderItem = {
        id: 'test1',
        title: 'test',
        isSubdirectory: true,
        type: '',
        size: 100,
        objectUrl: 'https://api.com/test',
        lastModifiedTime: '2021-04-14T15:08:35Z',
      };

      expect(() =>
        files.openCloudStorageFile(mockFolderCloudStorageItem, files.CloudStorageProvider.Box),
      ).toThrowError();
    });

    it('should send the message to parent if file is provided correctly', async () => {
      await utils.initializeWithContext('content');

      files.openCloudStorageFile(mockCloudStorageFolderItem, files.CloudStorageProvider.Box, FileOpenPreference.Inline);

      const openCloudStorageFileMessage = utils.findMessageByFunc('files.openCloudStorageFile');
      expect(openCloudStorageFileMessage).not.toBeNull();
      expect(openCloudStorageFileMessage.args).toEqual([
        mockCloudStorageFolderItem,
        files.CloudStorageProvider.Box,
        FileOpenPreference.Inline,
      ]);
    });
  });
  describe('openFilePreview', () => {
    it('should successfully open a file preview', async () => {
      await utils.initializeWithContext('content');

      files.openFilePreview({
        entityId: 'someEntityId',
        title: 'someTitle',
        description: 'someDescription',
        type: 'someType',
        objectUrl: 'someObjectUrl',
        downloadUrl: 'someDownloadUrl',
        webPreviewUrl: 'someWebPreviewUrl',
        webEditUrl: 'someWebEditUrl',
        baseUrl: 'someBaseUrl',
        editFile: true,
        subEntityId: 'someSubEntityId',
        viewerAction: ViewerActionTypes.view,
        fileOpenPreference: FileOpenPreference.Web,
      });

      let message = utils.findMessageByFunc('openFilePreview');
      expect(message).not.toBeNull();
      expect(message.args.length).toBe(13);
      expect(message.args[0]).toBe('someEntityId');
      expect(message.args[1]).toBe('someTitle');
      expect(message.args[2]).toBe('someDescription');
      expect(message.args[3]).toBe('someType');
      expect(message.args[4]).toBe('someObjectUrl');
      expect(message.args[5]).toBe('someDownloadUrl');
      expect(message.args[6]).toBe('someWebPreviewUrl');
      expect(message.args[7]).toBe('someWebEditUrl');
      expect(message.args[8]).toBe('someBaseUrl');
      expect(message.args[9]).toBe(true);
      expect(message.args[10]).toBe('someSubEntityId');
      expect(message.args[11]).toBe('view');
      expect(message.args[12]).toBe(FileOpenPreference.Web);
    });
  });

  it('should successfully open a file preview', async () => {
    await utils.initializeWithContext('content');

    files.openFilePreview({
      entityId: 'someEntityId',
      title: 'someTitle',
      description: 'someDescription',
      type: 'someType',
      objectUrl: 'someObjectUrl',
      downloadUrl: 'someDownloadUrl',
      webPreviewUrl: 'someWebPreviewUrl',
      webEditUrl: 'someWebEditUrl',
      baseUrl: 'someBaseUrl',
      editFile: true,
      subEntityId: 'someSubEntityId',
      viewerAction: ViewerActionTypes.view,
      fileOpenPreference: FileOpenPreference.Web,
    });

    let message = utils.findMessageByFunc('openFilePreview');
    expect(message).not.toBeNull();
    expect(message.args.length).toBe(13);
    expect(message.args[0]).toBe('someEntityId');
    expect(message.args[1]).toBe('someTitle');
    expect(message.args[2]).toBe('someDescription');
    expect(message.args[3]).toBe('someType');
    expect(message.args[4]).toBe('someObjectUrl');
    expect(message.args[5]).toBe('someDownloadUrl');
    expect(message.args[6]).toBe('someWebPreviewUrl');
    expect(message.args[7]).toBe('someWebEditUrl');
    expect(message.args[8]).toBe('someBaseUrl');
    expect(message.args[9]).toBe(true);
    expect(message.args[10]).toBe('someSubEntityId');
    expect(message.args[11]).toBe('view');
    expect(message.args[12]).toBe(FileOpenPreference.Web);
  });
});
