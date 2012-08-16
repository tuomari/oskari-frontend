/**
 * @class Oskari.mapframework.bundle.myplaces2.MyPlacesBundleInstance
 * 
 * Registers and starts the 
 * Oskari.mapframework.bundle.myplaces2.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.myplaces2.view.MainView",

/**
 * @method create called automatically on construction
 * @static
 */
function(instance) {
    this.instance = instance;
    this.popupId = 'myplacesForm';
    this.form = undefined;
}, {
    __name : 'MyPlacesMainView',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.instance.sandbox;
    },
    /**
     * @method init
     * implements Module protocol init method
     */
    init : function() {
    },
    /**
     * @method start
     * implements Module protocol start methdod
     */
    start : function() {
        var me = this;
        
        var sandbox = this.instance.sandbox;
        sandbox.register(me);
        for(p in me.eventHandlers) {
            sandbox.registerForEventByName(me, p);
        }
        
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        
        // register plugin for map (drawing for my places)
        var drawPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.DrawPlugin');
        mapModule.registerPlugin(drawPlugin);
        mapModule.startPlugin(drawPlugin);
        this.drawPlugin = drawPlugin;
        
        // register plugin for map (hover tooltip for my places)
        // TODO: start when a myplaces layer is added and stop when last is removed?
        /*var hoverPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.plugin.HoverPlugin');
        mapModule.registerPlugin(hoverPlugin);
        mapModule.startPlugin(hoverPlugin);
        this.hoverPlugin = hoverPlugin;
        */
    },
    /**
     * @method update
     * implements Module protocol update method
     */
    stop : function() {
        var sandbox = this.instance.sandbox;
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
        sandbox.unregister(this);
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
     */
    onEvent : function(event) {

        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }

        return handler.apply(this, [event]);

    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        /**
         * @method Toolbar.ToolSelectedEvent
         * User changed tool -> cancel myplaces actions
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'Toolbar.ToolSelectedEvent' : function(event) {
            // changed tool
            this._cleanupPopup();
        },
        /**
         * @method MyPlaces.FinishedDrawingEvent
         * @param {Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent} event
         */
        'MyPlaces.FinishedDrawingEvent' : function(event) {
            this._handleFinishedDrawingEvent(event);
        }
    },
    /**
     * @method _handleFinishedDrawingEvent
     * Handles custom event when drawing is finished
     * @private
     * @param {Oskari.mapframework.bundle.myplaces2.event.FinishedDrawingEvent} event
     */
    _handleFinishedDrawingEvent : function(event) {
        var center = event.getDrawing().getCentroid();
        var lonlat = {
            lon : center.x,
            lat : center.y
        };
        this.showPlaceForm(lonlat);
    },
    /**
     * @method showPlaceForm
     * Displays a form popup on given location. Prepopulates the form if place is given
     * @param {OpenLayers.LonLat} location location to point with the popup
     * @param {Oskari.mapframework.bundle.myplaces2.model.MyPlace} place prepoluate form with place data (optional)
     */
    showPlaceForm : function(location, place) {
        var me = this;
        var sandbox = this.instance.sandbox;
        var loc = this.instance.getLocalization();
        this.form = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.view.PlaceForm', this.instance);
        var categories = this.instance.getService().getAllCategories();
        if(place) {
            var param = {
                place : {
                    id: place.getId(),
                    name : place.getName(),
                    desc : place.getDescription(),
                    category : place.getCategoryID()
                }
            };
            this.form.setValues(param);
        }
        
        var content = [{
            html : me.form.getForm(categories),
            actions : {}
        }];
        // cancel button
        content[0].actions[loc.buttons.cancel] = function() {
            me._cleanupPopup();
            // ask toolbar to select default tool
            var toolbarRequest = me.instance.sandbox.getRequestBuilder('Toolbar.SelectToolButtonRequest')();
            me.instance.sandbox.request(me, toolbarRequest);
        }; 
        // save button
        content[0].actions[loc.buttons.save] = function() {
            me._saveForm();
        }; 

        var request = sandbox.getRequestBuilder('InfoBox.ShowInfoBoxRequest')(this.popupId, loc.placeform.title, content, location, true);
        sandbox.request(me.getName(), request);
    },
    /**
     * @method _validateForm
     * Validates form data
     * @private
     * @param {Object} values form values as returned by Oskari.mapframework.bundle.myplaces2.view.PlaceForm.getValues()
     * @return {Boolean} true if values are ok
     */
    _validateForm : function(values) {
        var blnOk = true;
        var loc = this.instance.getLocalization('validation');
       
        if(!values.place.name)
        {
             alert(loc.placeName);
             blnOk = false;
        }
        var errors = this.instance.getCategoryHandler().validateCategoryFormValues(values.category);
        if(errors.length != 0) {
            alert(errors);
            blnOk = false;
        }
        return blnOk;
    },
    /**
     * @method _saveForm
     * @private
     * Handles save button on my places form.
     * If a new category has been defined -> saves it and calls _savePlace() 
     * for saving the actual place data after making the new category available.
     */
    _saveForm : function() {
        // form not open, nothing to do
        if(!this.form) {
            return;
        }
        var me = this;
        var formValues = this.form.getValues();
        // validation
        if(!this._validateForm(formValues)) {
            return;
        }
        // validation passed -> go save stuff
        // new category given -> save it first 
        if(formValues.category) {
            
            var category = this.instance.getCategoryHandler().getCategoryFromFormValues(formValues.category);
            
            var serviceCallback = function(blnSuccess, model, blnNew) {
                if(blnSuccess) {
                    // add category as a maplayer to oskari maplayer service
                    // NOTE! added as a map layer to maplayer service through categoryhandler getting an event
                    //me.instance.addLayerToService(model);
                    // save the actual place
                    formValues.place.category = model.getId();
                    me.__savePlace(formValues.place);
                }
                else {
                    // blnNew should always be true since we are adding a category
                    var loc = me.instance.getLocalization('notification')['error'];
                    if(blnNew) {
                        alert(loc.addCategory);
                    }
                    else {
                        alert(loc.editCategory);
                    }
                }
            }
            this.instance.getService().saveCategory(category,serviceCallback);
        }
        // category selected from list -> save place
        else {
            this.__savePlace(formValues.place);
        }
    },
    /**
     * @method __savePlace
     * Handles save place after possible category save
     * @private
     * @param {Object} values place properties
     */
    __savePlace : function(values) {
        var me = this;
        // form not open, nothing to do
        if(!values) {
            // should not happen
            var loc = me.instance.getLocalization('notification')['error'];
            alert(loc.generic);
            return;
        }
        var place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces2.model.MyPlace');
        var oldCategory = -1;
        if(values.id) {
            place = this.instance.getService().findMyPlace(values.id);
            oldCategory = place.getCategoryID();
        }
        place.setId(values.id);
        place.setName(values.name);
        place.setDescription(values.desc);
        place.setCategoryID(values.category);
        // fetch the latest geometry if edited after FinishedDrawingEvent
        place.setGeometry(this.drawPlugin.getDrawing());
        
        var sandbox = this.instance.sandbox;
        var serviceCallback = function(blnSuccess, model, blnNew) {
            if(blnSuccess) {
                if(!blnNew) {
                    // refresh map layer on map -> send update request
                    var layerId = me.instance.getCategoryHandler()._getMapLayerId(place.getCategoryID());
                    var requestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerUpdateRequest')
                    var request = requestBuilder(layerId, true);
                    sandbox.request(me, request);
                    // refresh old layer as well if category changed
                    if(oldCategory != place.getCategoryID()) {
                        layerId = me.instance.getCategoryHandler()._getMapLayerId(oldCategory);
                        request = requestBuilder(layerId, true);
                        sandbox.request(me, request);
                    }
                }
                
                me._cleanupPopup();

                var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                var loc = me.instance.getLocalization('notification').placeAdded;
                dialog.show(loc.title, loc.message);
                dialog.fadeout();
                // remove drawing
                me.drawPlugin.stopDrawing();
            }
            else {
                var loc = me.instance.getLocalization('notification')['error'];
                alert(loc.savePlace);
            }
        }
        this.instance.getService().saveMyPlace(place,serviceCallback);
    },
    /**
     * @method _cleanupPopup
     * Cancels operations:
     * - close popup
     * - destroy form
     * @private
     */
    _cleanupPopup : function() {
        // form not open, nothing to do
        if(!this.form) {
            return;
        }
        var sandbox = this.instance.sandbox;
        var request = sandbox.getRequestBuilder('InfoBox.HideInfoBoxRequest')(this.popupId);
        sandbox.request(this, request);
        this.form.destroy();
        this.form = undefined;
    }
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.mapframework.module.Module']
});
