Oskari.registerLocalization({
    "lang": "en",
    "key": "AdminHierarchicalLayerList",
    "value": {
        "buttons": {
            "add": "Add",
            "cancel": "Cancel",
            "update": "Update",
            "delete": "Delete",
            "ok": "Ok",
            "select": "Select"
        },
        "tooltips": {
            "addMainGroup": "Add main group",
            "addSubgroup": "Add subgroup",
            "editMainGroup": "Edit main group",
            "editSubgroup": "Edit subgroup",
            "addLayer": "Add maplayer",
            "editLayer": "Edit maplayer"
        },
        "groupTitles": {
            "addMainGroup": "Main group name",
            "addSubgroup": "Subgroup name",
            "localePrefix": "Name in",
            "editMainGroup": "Edit main group",
            "editSubgroup": "Edit subgroup",
            "addLayer": "Add maplayer",
            "addDataprovider": "Add dataprovider",
            "selectLayerGroups": "Select layer groups"
        },
        "selectableGroup": "Selection group",
        "errors": {
            "groupname": {
                "title": "Check group name",
                "message": "The group name should be over 3 characters long"
            },
            "groupnameSave": {
                "title": "Group saving failed",
                "message": "Group saving failed, try again later"
            },
            "groupnameDeleteCheckLayers": {
                "title": "Check the group layers",
                "message": "The group has layers or sub-groups, move them under the other group and then remove the group."
            },
            "groupnameDelete": {
                "title": "Group deleting failed",
                "message": "Group deleting failed, try again later"
            },
            "nodeDropSave": {
                "title": "Tason/ryhmän siirto ei onnistunut -en",
                "message": "Virhe tason/ryhmän siirrossa, kokeile myöhemmin uudelleen -en"
            },
            "dataprovider": {
                "title": "Check dataprovider name",
                "message": "The dataprovider name should be over 3 characters long"
            },
            "dataproviderSave": {
                "title": "Dataprovider saving failed",
                "message": "Dataprovider saving failed, try again later"
            },
            "maplayerGroups": {
                "title": "Check maplayer groups",
                "message": "Maplayer must have least one group"
            }
        },
        "succeeses": {
            "groupnameSave": {
                "title": "Group saving was successful",
                "message": "Group saving was successful"
            },
            "groupnameDelete": {
                "title": "Group deleting was successfull",
                "message": "Group deleting was successfull"
            },
            "nodeDropSave": {
                "title": "Tason/ryhmän siirto onnistui -en",
                "message": "Tason/ryhmän siirto onnistui -en"
            },
            "dataproviderSave": {
                "title": "Dataprovider saving was successful",
                "message": "Dataprovider saving was successful"
            }
        },
        "confirms": {
            "groupDelete": {
                "title": "Do you want to delete",
                "message": "Do you want to delete {groupname} group ?"
            },
            "nodeDropSave": {
                "title": "Haluatko siirtää tason/ryhmän -en",
                "message": "Haluatko siirtää tason/ryhmän? -en"
            }
        },
        "admin": {
            "capabilitiesLabel": "Capabilities",
            "capabilitiesRemarks": "(*)  Current map CRS is not supported in the service capabilities",
            "confirmResourceKeyChange": "You have changed the unique name or  the interface address for this map layer. For security reasons the user rights for this map layer will be removed and you must set them again. Do you want to continue?",
            "confirmDeleteLayerGroup": "The map layer group will be removed. Do you want to continue?",
            "confirmDeleteLayer": "The map layer will be removed. Do you want to continue?",
            "layertypes": {
                "wms": "WMS layer",
                "wfs": "WFS layer",
                "wmts": "WMTS layer",
                "arcgis": "ArcGISCache layer",
                "arcgis93": "ArcGISRest layer"
            },
            "selectLayer": "Select map layer",
            "selectSubLayer": "Select sub layer",
            "addOrganization": "Add organisation",
            "addOrganizationDesc": "Add a new organisation / data provider.",
            "addInspire": "Add theme",
            "addInspireDesc": "Add a new theme.",
            "addLayer": "Add map layer",
            "addLayerDesc": "Add a new map layer to this theme.",
            "edit": "Edit",
            "editDesc": "Edit the map layer's name.",
            "layerType": "Map layer type",
            "layerTypeDesc": "Select an approriate layer type. The current options are WMS (Web Map Service), WFS (Web Feature Service), WMTS (Web Map Tile Service), ArcGisCache (ArcGis Cache tile) and ArcGisRest (ArcGis rest layer).",
            "type": "Map layer type",
            "typePlaceholder": "The selected map layer type. Please click \"Cancel\" and try again, if you want to change the type.",
            "baseLayer": "Background map layer",
            "groupLayer": "Map layer group",
            "interfaceVersion": "Interface version",
            "interfaceVersionDesc": "Select an appropriate version. Prioritize the newest version that is supported.",
            "wms1_1_1": "WMS 1.1.1",
            "wms1_3_0": "WMS 1.3.0",
            "getInfo": "Get info",
            "editWfs": "Edit WFS",
            "selectClass": "Select theme",
            "selectClassDesc": "Select a theme describing the map layer from the list.",
            "baseName": "Background Map Layer Name",
            "groupName": "Map Layer Group name",
            "subLayers": "Sub layers",
            "addSubLayer": "Add sub layer",
            "editSubLayer": "Edit sub layer",
            "wmsInterfaceAddress": "Interface URL",
            "wmsUrl": "Interface URL",
            "wmsInterfaceAddressDesc": "Type the web service address in the URL form without question mark and other parameters after that. Fetch map layer parameters by clicking \"Get info\".",
            "wmsServiceMetaId": "Service metadata identifier",
            "wmsServiceMetaIdDesc": "Give a file identifier for the metadata describing the interface.",
            "layerNameAndDesc": "Map Layer Name and Description",
            "metaInfoIdDesc": "The metadata file identifier is an XML file identifier. It is fetched automatically from the GetCapabilities response.",
            "metaInfoId": "Metadata file identifier",
            "wmsName": "Unique name",
            "wmsNameDesc": "The unique name is a technical identifier. It is fetched automatically from the GetCapabilities response.",
            "username": "Username",
            "password": "Password",
            "attributes": "Attributes",
            "selectedTime": "Selected time",
            "time": "Supported time",
            "addInspireName": "Theme Name",
            "addInspireNameTitle": "Type a theme name in different languages.",
            "addOrganizationName": "Data Provider Name",
            "addOrganizationNameTitle": "Type the organisation name in different languages.",
            "addNewClass": "Add theme",
            "addNewLayer": "Add map layer",
            "addNewGroupLayer": "Add map layer group",
            "addNewBaseLayer": "Add background map",
            "addNewOrganization": "Add organisation",
            "addInspireTheme": "Theme",
            "addInspireThemeDesc": "Select an appropriate theme from the list.",
            "opacity": "Opacity",
            "opacityDesc": "Define the opacity that is used by default. If the opacity is 100%, it covers up all other layers below the layer. If the opacity is 0%, it is totally transparent. Users can control opacity in the ‘Selected Layers’ menu.",
            "style": "Default Style",
            "styleDesc": "The style options are fetched automatically from the GetCapabilities response. Select a default style from the list. If there are several options, users can select a theme in the ‘Selected Layers’ menu.",
            "importStyle": "New sld style",
            "addNewStyle": "Add new SLD style",
            "sldStyleName": "Style name",
            "sldFileContentDesc": "Copy/paste SLD file content (xml) to text area",
            "sldFileContent": "SLD file content",
            "sldStylesFetchError": "Couldn't get SLD styles",
            "addSldStyleDesc": "Select styles for the current layer",
            "addSldStyle": "Sld style selection",
            "minScale": "Minimum scale",
            "minScaleDesc": "The minimum scale is fetched automatically from the GetCapabilities response. The map layer is shown only if the scale is above this limit. Scales are defines as scale denominators. If scale limits are not defined, the map layers is shown at all scale levels.",
            "minScalePlaceholder": "Minimum scale in the form 5669294 (1:5669294)",
            "maxScale": "Maximum scale",
            "maxScaleDesc": "The maximum scale is fetched automatically from the GetCapabilities response. The map layer is shown only if the scale is below this limit. Scales are defines as scale denominators. If scale limits are not defined, the map layers is shown at all scale levels.",
            "maxScalePlaceholder": "Maximum scale in the form 1 (1:1)",
            "srsName": "Coordinate system",
            "srsNamePlaceholder": "Define a appropriate coordinate system.",
            "legendImage": "Default legend URL",
            "legendImageDesc": "The URL address for map layer legend is fetched automatically from the GetCapabilities response.",
            "legendImagePlaceholder": "Give the URL address of the map legend.",
            "legendUrl": "Legend URL selection",
            "legendUrlDesc": "Select default legend via legend url selection",
            "noServiceLegendUrl": "Legend URL is not in wms service legends",
            "gfiContent": "Additional GFI info",
            "gfiResponseType": "GFI response type",
            "gfiResponseTypeDesc": "Select a format for Get Feature Information (GFI). Possible formats are fetched automatically from the GetCapabilities response.",
            "gfiStyle": "GFI style (XSLT)",
            "gfiStyleDesc": "Define a style for Get Feature Information (GFI) as XSLT transformation.",
            "manualRefresh": "Manual refresh",
            "resolveDepth": "Resolve depth",
            "matrixSetId": "WMTS TileMatrixSet ID",
            "matrixSetIdDesc": "WMTS TileMatrixSet ID is a technical tile matrix identifier. It is fetched automatically from the GetCapabilities response.",
            "matrixSet": "JSON for WMTS layer",
            "matrixSetDesc": "The layer data in the JSON format is fetched automatically from the GetCapabilities response.",
            "realtime": "Real time layer",
            "refreshRate": "Click the checkbox, if the map layer is updated in real time. The refresh rate is defined in the seconds.",
            "jobTypeDesc": "WFS engine",
            "jobTypeDefault": "default",
            "jobTypes": {
                "default": "Default",
                "fe": "Feature engine"
            },
            "generic": {
                "placeholder": "Name in {lang}",
                "descplaceholder": "Description in {lang}"
            },
            "en": {
                "title": "En",
                "placeholder": "Name in English",
                "descplaceholder": "Description in English"
            },
            "fi": {
                "title": "Fi",
                "placeholder": "Name in Finnish",
                "descplaceholder": "Description in Finnish"
            },
            "sv": {
                "title": "Sv",
                "placeholder": "Name in Swedish",
                "descplaceholder": "Description in Swedish"
            },
            "interfaceAddress": "Interface URL",
            "interfaceAddressDesc": "Type the web service address in the URL form without question mark and other parameters after that. Fetch map layer parameters by clicking \"Get data\".",
            "viewingRightsRoles": "View rights to roles",
            "metadataReadFailure": "The map layer metadata could not be fetched.",
            "permissionFailure": "The given username or password is invalid.",
            "mandatory_field_missing": "The following field(s) are required:",
            "invalid_field_value": "The given value is invalid:",
            "operation_not_permitted_for_layer_id": "You do not have rights to update or add map layers.",
            "no_layer_with_id": "The map layer with this id does not exist. It may have already been removed.",
            "success": "Update succeeded",
            "errorRemoveLayer": "The map layer could not be removed.",
            "errorInsertAllreadyExists": "The new map layer has been added. A map layer with same identifier already exists.",
            "errorRemoveGroupLayer": "The map layer group could not be removed.",
            "errorSaveGroupLayer": "The map layer group could not be saved.",
            "errorTitle": "Error",
            "warningTitle": "Warning",
            "successTitle": "Saving Succeeded",
            "warning_some_of_the_layers_could_not_be_parsed": "Some of the map layers could not be parsed.",
            "addDataprovider": "Dataprovider",
            "groupTitle": "Map layer group name",
            "addDataproviderButton": "Add",
            "maplayerGroups": "Maplayer groups",
            "selectMaplayerGroupsButton": "Select groups"
        },
        "cancel": "Cancel",
        "add": "Add",
        "save": "Save",
        "delete": "Remove",
        "ok": "OK"
    }
});