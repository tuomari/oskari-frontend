import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { Classification } from '../components/classification/Classification';
import { ManualClassificationView } from '../components/manualClassification/View';
import '../resources/scss/classificationplugin.scss';
/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',

    function (instance, config, locale, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._index = 9;
        this._defaultLocation = me._config.legendLocation || 'right bottom';
        me._fixedLocation = true;
        me._name = 'ClassificationPlugin';
        me.element = null;
        me._templates = {
            main: jQuery('<div class="mapplugin statsgrid-classification-plugin"></div>')
        };
        // for publisher dragndrop to work needs to have at least:
        // -  mapplugin-class in parent template
        // - _setLayerToolsEditModeImpl()
        // - publisher tool needs to implement getPlugin()
        // publisher tool writes location to statsgrid.conf.legendLocation since this is not only a plugin
        //  for this reason we need to call setLocation() manually as location is not in the default path "config.location.classes"
        // me.setLocation(config.legendLocation || me._defaultLocation);

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
        this.node = null;
        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this.indicatorData = {};
        this._bindToEvents();
        this.service.getStateService().initClassificationPluginState(this._config, this._instance.isEmbedded());
    }, {
        _createControlElement: function () {
            if (this.element !== null) {
                return this.element;
            }
            this.element = this._templates.main.clone();
            this.element.css('z-index', 15001);
            return this.element;
        },
        rendered: function (isEdit) {
            // check if edit classification state is changed
            if (isEdit !== this._previousIsEdit) {
                if (isEdit) {
                    this._overflowCheck(true);
                } else {
                    this._restoreOverflow();
                }
                this._previousIsEdit = isEdit;
            }
            this._overflowCheck();
        },
        render: function () {
            if (!this.node) {
                return;
            }
            const { error, ...state } = this.service.getStateService().getStateForClassification();
            if (error) return;
            const { data, status, validDataCount } = this.getIndicatorData(state);
            if (status === 'PENDING') return;
            const editOptions = this.getEditOptions(state, validDataCount);
            const classifiedDataset = this.classifyDataset(state, data);
            const manualView = this.getManualViewProps(state);

            ReactDOM.render((
                <LocaleProvider value={{ bundleKey: this._instance.getName() }}>
                    <Classification
                        { ...state }
                        editOptions = {editOptions}
                        classifiedDataset = {classifiedDataset}
                        manualView = {manualView}
                        data = {data}
                        onRenderChange = {this.rendered.bind(this)}
                    />
                </LocaleProvider>
            ), this.node);
        },
        getIndicatorData: function (state) {
            const { activeIndicator, regionset: activeRegionset } = state;
            const isSerie = !!activeIndicator.series;
            const { status, hash, regionset } = this.indicatorData;
            const serieSelection = isSerie ? this.service.getSeriesService().getValue() : null;
            if (status !== 'PENDING' && hash === activeIndicator.hash && regionset === activeRegionset) {
                if (!isSerie || serieSelection === this.indicatorData.serieSelection) {
                    return this.indicatorData;
                }
            }
            this.indicatorData = {
                hash: activeIndicator.hash,
                regionset: activeRegionset,
                data: {},
                validDataCount: 0,
                serieSelection,
                status: 'PENDING'
            };
            this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, activeIndicator.series, activeRegionset, (err, data) => {
                if (this.indicatorData.hash !== activeIndicator.hash) return; // not latest active indicator response
                if (data) {
                    this.indicatorData.validDataCount = Object.values(data).filter(val => val !== undefined).length;
                    this.indicatorData.data = data;
                    this.indicatorData.status = 'DONE';
                }
                if (err) {
                    this.log.warn('Error getting indicator data', activeIndicator, activeRegionset);
                    this.indicatorData.status = 'ERROR';
                }
                this.render();
            });
            return this.indicatorData;
        },
        getEditOptions: function (state, validDataCount) {
            // TODO validate values here or in controller
            const { activeIndicator } = state;
            const { type, count, reverseColors, mapStyle } = activeIndicator.classification;
            const { count: minmax, methods, modes, mapStyles } = this.service.getClassificationService().getLimits();
            const colorsService = this.service.getColorService();
            const types = colorsService.getAvailableTypes();

            let colorsets = [];
            let max = minmax.max;
            if (mapStyle !== 'points') {
                colorsets = colorsService.getOptionsForType(type, count, reverseColors);
                const { max: colorMax } = colorsService.getRange(type);
                max = colorMax;
            }
            const dataMax = validDataCount - 1;
            const counts = [];
            // TODO disable invalid counts?
            for (let i = minmax.min; i <= Math.min(dataMax, max); i++) {
                counts.push({ value: i });
            }
            const disabled = [];
            if (validDataCount < 3) {
                disabled.push('jenks');
            }
            if (activeIndicator.series) {
                // Discontinous mode causes trouble with manually set bounds. Causes error if some class gets no hits.
                disabled.push('discontinuous');
            }
            const toOption = (option, value) => ({
                value,
                title: this._locale(`classify.${option}.${value}`),
                disabled: disabled.includes(value)
            });

            return {
                methods: methods.map(val => toOption('methods', val)),
                modes: modes.map(val => toOption('modes', val)),
                mapStyles: mapStyles.map(val => toOption('mapStyles', val)),
                types: types.map(val => toOption('types', val)),
                counts,
                colorsets
            };
        },
        classifyDataset: function (state, data) {
            const { activeIndicator: { classification }, seriesStats } = state;
            return this.service.getClassificationService().getClassification(data, classification, seriesStats);
        },
        getManualViewProps: function (state) {
            const { classification } = state.activeIndicator;
            if (classification.method !== 'manual') return;
            const { seriesService, classificationService, colorService } = this.service.getAllServices();
            return {
                view: new ManualClassificationView(classificationService, colorService, classification),
                setAnimating: seriesService.setAnimating,
                btnLabel: this._locale('classify.edit.title')
            };
        },

        redrawUI: function () {
            // No need to redraw because mobile & desktop is same
            return false;
        },
        toggleUI: function () {
            this.element ? this.teardownUI() : this.buildUI();
            return !!this.element;
        },
        teardownUI: function () {
            var element = this.getElement();
            if (this.node) {
                ReactDOM.unmountComponentAtNode(this.node);
                this.node = null;
            }
            if (element) {
                this.removeFromPluginContainer(element);
                this.element = null;
            }
            this.trigger('hide');
        },
        buildUI: function () {
            if (!this.element) {
                this.addToPluginContainer(this._createControlElement());
                this._makeDraggable();
                this.node = this.element.get(0);
                this.render();
            }
            this.trigger('show');
        },
        _makeDraggable: function () {
            this.getElement().draggable({
                handle: '.active-header,.statsgrid-svg-legend'
            });
        },
        getElement: function () {
            return this.element;
        },
        stopPlugin: function () {
            this.teardownUI();
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },
        _overflowCheck: function (storeOverflow) {
            var pluginEl = this.getElement();
            if (!pluginEl) {
                return;
            }
            if (pluginEl.css('position') === 'absolute') {
                const { top, left } = pluginEl.offset();
                const bottom = top + pluginEl.height();
                const wHeight = jQuery(window).height();
                let offsetToWindowBottom = wHeight - bottom - 10; // add margin 10
                if (this._defaultLocation.includes('bottom')) {
                    const pluginContainer = jQuery('.mapplugins.bottom.right');
                    const containerHeight = pluginContainer.outerHeight();
                    const offsetToContainer = pluginEl.position().left + pluginEl.outerWidth() + 10;
                    if (offsetToContainer > 0) {
                        offsetToWindowBottom = offsetToWindowBottom - containerHeight + 10; // remove margin 10
                    }
                    // prevent to flow over top when map size is changed
                    if (top < 0) {
                        pluginEl.css('top', containerHeight - wHeight + 'px');
                    }
                    // prevent to flow over left when map size is changed
                    if (left < 0) {
                        const wWidth = jQuery(window).width();
                        const containerWidth = pluginContainer.outerWidth();
                        pluginEl.css('left', containerWidth - wWidth + 'px');
                    }
                }
                if (offsetToWindowBottom < 0) {
                    if (storeOverflow === true) {
                        this._overflowedOffset = offsetToWindowBottom;
                    }
                    pluginEl.css('top', pluginEl.position().top + offsetToWindowBottom + 'px');
                }
            }
        },
        _restoreOverflow: function () {
            var pluginEl = this.getElement();
            if (this._overflowedOffset === null || !pluginEl) {
                return;
            }
            pluginEl.css('top', pluginEl.position().top - this._overflowedOffset + 'px');
            this._overflowedOffset = null;
        },
        hasUI: function () {
            // Plugin has ui element but returns false, because
            // otherwise publisher would stop this plugin and start it again when leaving the publisher,
            // instance updates visibility
            return false;
        },
        _bindToEvents: function () {
            // if indicator is removed/added - recalculate the source 1/2 etc links
            this.service.on('StatsGrid.IndicatorEvent', () => this.render());

            // Always show the active indicator - also handles "no indicator selected"
            this.service.on('StatsGrid.ActiveIndicatorChangedEvent', () => this.render());

            // need to update the legend as data changes when regionset changes
            this.service.on('StatsGrid.RegionsetChangedEvent', () => this.render());

            this.service.on('StatsGrid.ClassificationChangedEvent', () => this.render());

            // UI styling changes e.g. disable classification editing, make transparent
            this.service.getStateService().on('ClassificationPluginChanged', () => this.render());
            // need to update transparency select
            this.service.on('AfterChangeMapLayerOpacityEvent', () => this.render());
            // need to calculate contents max height and check overflow
            this.service.on('MapSizeChangedEvent', () => this.render());
            // need to update labels
            this.service.on('StatsGrid.ParameterChangedEvent', () => this.render());
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
