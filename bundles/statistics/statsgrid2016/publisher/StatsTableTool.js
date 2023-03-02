Oskari.clazz.define('Oskari.mapframework.publisher.tool.StatsTableTool', function () {
}, {
    index: 1,
    group: 'data',

    groupedSiblings: false,
    templates: {},
    id: 'table',
    /**
     * Initialize tool
     * @params {} state data
     * @method init
     * @public
     */
    init: function (data) {
        const conf = this.getStatsgridConf(data);
        this.setEnabled(conf.grid === true);
    },
    /**
    * Get tool object.
     * @params {}  pdta.configuration.publishedgrid.state
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function (pdata) {
        var me = this;
        if (!me.__tool) {
            me.__tool = {
                id: 'Oskari.statistics.statsgrid.StatsGridBundleInstance',
                title: 'grid',
                config: {
                    grid: true
                }
            };
        }
        return me.__tool;
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled: function (enabled) {
        var me = this;
        var changed = me.state.enabled !== enabled;
        me.state.enabled = enabled;

        var stats = this.getStatsgridBundle();
        if (!stats || !changed) {
            return;
        }
        if (enabled) {
            stats.togglePlugin.addTool(this.id);
        } else {
            stats.togglePlugin.removeTool(this.id);
        }
    },
    getValues: function () {
        return this.getConfiguration({ grid: this.isEnabled() });
    },
    stop: function () {
        var stats = this.getStatsgridBundle();
        if (stats) {
            stats.togglePlugin.removeTool(this.id);
        }
    }
}, {
    'extend': ['Oskari.mapframework.publisher.tool.AbstractStatsPluginTool'],
    'protocol': ['Oskari.mapframework.publisher.Tool']
});
