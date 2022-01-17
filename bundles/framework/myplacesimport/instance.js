import { showLayerForm } from './LayerForm';

/**
 * @class Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance', function () {
    // these will be used for this.conf if nothing else is specified (handled by DefaultExtension)
    this.defaultConf = {
        name: 'MyPlacesImport',
        sandbox: 'sandbox',
        stateful: false,
        flyoutClazz: 'Oskari.mapframework.bundle.myplacesimport.Flyout'
    };
    this.buttonGroup = 'myplaces';
    this.toolName = 'import';
    this.tool = {
        iconCls: 'upload-material',
        sticky: false
    };
    this.importService = undefined;
    this.mapLayerService = null;
    this.tab = undefined;
    this.layerType = 'userlayer';
    this.popupControls = null;
    this.popupCleanup = () => {
        this.popupControls = null;
    };
}, {
    /**
     * Registers itself to the sandbox, creates the tab and the service
     * and adds the flyout.
     *
     * @method start
     */
    start: function () {
        var me = this;
        var conf = this.getConfiguration() || {};
        var sandbox = Oskari.getSandbox(conf.sandbox);

        this.sandbox = sandbox;
        sandbox.register(this);

        // stateful
        if (conf && conf.stateful === true) {
            sandbox.registerAsStateful(this.mediator.bundleId, this);
        }
        var isGuest = !Oskari.user().isLoggedIn();

        if (isGuest) {
            // guest user, only show disabled button
            this.tool.disabled = true;
        } else {
            // logged in user, create UI
            this.tab = this.addTab(sandbox);
            this.importService = this.createService(sandbox);
            this.importService.init();
            this.importService.getUserLayers(function () {
                me.getTab().refresh();
            });

            sandbox.request(this, Oskari.requestBuilder('userinterface.AddExtensionRequest')(this));
        }

        this.registerTool(isGuest);
    },
    /**
     * Requests the tool to be added to the toolbar.
     *
     * @method registerTool
     */
    registerTool: function (isGuest) {
        var me = this;
        var loc = this.getLocalization();
        var sandbox = this.getSandbox();
        var reqBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
        this.tool.callback = function () {
            if (!isGuest) {
                // toolbar requires a callback so we need to check guest flag
                // inside callback instead of not giving any callback
                me.startTool();
            }
        };
        this.tool.tooltip = loc.tool.tooltip;

        if (reqBuilder) {
            sandbox.request(this, reqBuilder(this.toolName, this.buttonGroup, this.tool));
        }
    },
    /**
     * Opens the flyout when the tool gets clicked.
     *
     * @method startTool
     */
    startTool: function () {
        const toolbarReqBuilder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
        this.openLayerDialog();
        if (toolbarReqBuilder) {
            // ask toolbar to select the default tool
            this.getSandbox().request(this, toolbarReqBuilder());
        }
    },
    getMapLayerService: function () {
        if (!this.mapLayerService) {
            this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        }
        return this.mapLayerService;
    },
    openLayerDialog: function (values = {}) {
        const { id } = values;
        const isImport = !id;
        const conf = {
            maxSize: parseInt(this.conf.maxFileSizeMb),
            isImport
        };
        const closeCb = () => this.closeLayerDialog();
        const save = values => this.getService().submitUserLayer(values, closeCb);
        const update = values => this.getService().updateUserLayer(id, values, closeCb);
        // create popup
        const onOk = isImport ? save : update;
        this.popupControls = showLayerForm(values, conf, onOk, this.popupCleanup);
    },
    closeLayerDialog: function () {
        if (!this.popupControls) {
            return;
        }
        this.popupControls.close();
        this.popupControls = null;
    },
    /**
     * Adds the user layer to the map layer service and to the map.
     *
     * @method addUserLayer
     * @param {JSON} layerJson
     */
    addUserLayer: function (layerJson) {
        if (!layerJson) {
            return;
        }

        var me = this;
        var sandbox = this.getSandbox();

        this.getService().addLayerToService(layerJson, false, function (mapLayer) {
            // refresh the tab
            me.getTab().refresh();
            // Request the layer to be added to the map.
            var reqBuilder = Oskari.requestBuilder('AddMapLayerRequest');
            if (reqBuilder) {
                sandbox.request(me, reqBuilder(mapLayer.getId()));
            }
            // Request to move and zoom map to layer's content
            var mapMoveByContentReqBuilder = Oskari.requestBuilder('MapModulePlugin.MapMoveByLayerContentRequest');
            if (mapMoveByContentReqBuilder) {
                sandbox.request(me, mapMoveByContentReqBuilder(mapLayer.getId(), true));
            }
        });
    },
    /**
     * Creates the import service and registers it to the sandbox.
     *
     * @method createService
     * @param  {Oskari.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    createService: function (sandbox) {
        var importService = Oskari.clazz.create(
            'Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService',
            this
        );
        sandbox.registerService(importService);
        return importService;
    },
    /**
     * Returns the import service.
     *
     * @method getService
     * @return {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportService}
     */
    getService: function () {
        return this.importService;
    },
    /**
     * Creates the user layers tab and adds it to the personaldata bundle.
     *
     * @method addTab
     * @param {Oskari.Sandbox} sandbox
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    addTab: function (sandbox) {
        var loc = this.getLocalization();
        var userLayersTab = Oskari.clazz.create('Oskari.mapframework.bundle.myplacesimport.UserLayersTab', this);
        var addTabReqBuilder = Oskari.requestBuilder('PersonalData.AddTabRequest');

        if (addTabReqBuilder) {
            sandbox.request(this, addTabReqBuilder(loc.tab.title, userLayersTab.getContent(), false, 'userlayers'));
        }
        return userLayersTab;
    },
    /**
     * @method getTab
     * @return {Oskari.mapframework.bundle.myplacesimport.UserLayersTab}
     */
    getTab: function () {
        return this.tab;
    }
}, {
    'extend': ['Oskari.userinterface.extension.DefaultExtension']
});
