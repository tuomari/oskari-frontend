import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';
import { SearchInput } from 'oskari-ui';
import { AdvancedSearchContainer } from './advanced-search/AdvancedSearchContainer';
const Description = () => {
    return <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'metadataSearchDescription')}</div>;
};

const SearchContainer = (props) => {
    const { query, onChange, onSearch } = props;
    return <div>
        <SearchInput
            query={query}
            onChange={(event) => onChange(event.target.value)}
            placeholder={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'placeholder')}
            onSearch={onSearch}/>
    </div>;
};

SearchContainer.propTypes = {
    query: PropTypes.string,
    onChange: PropTypes.func,
    onSearch: PropTypes.func
};

const MetadataSearchContainer = ({ state, controller }) => {
    const { query, advancedSearchExpanded, advancedSearchOptions, advancedSearchValues } = state;
    return <div>
        <Description/>
        <SearchContainer query={query} onChange={controller.updateQuery} onSearch={controller.doSearch}/>
        <AdvancedSearchContainer
            isExpanded={advancedSearchExpanded}
            toggleAdvancedSearch={controller.toggleAdvancedSearch}
            advancedSearchOptions={advancedSearchOptions}
            advancedSearchValues={advancedSearchValues}
            controller={controller}/>
    </div>;
};

MetadataSearchContainer.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object,
    advancedSearchOptions: PropTypes.object
};

export const renderMetadataSearchContainer = (state, controller, element) => {
    const render = (state, controller) => {
        ReactDOM.render(<MetadataSearchContainer state={state} controller={controller} />, element);
    };

    render(state, controller);
    return {
        update: render
    };
};
