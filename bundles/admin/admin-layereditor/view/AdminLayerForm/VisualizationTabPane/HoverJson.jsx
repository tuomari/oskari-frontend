import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';
import { JsonInput } from '../JsonInput';
import { InfoTooltip } from '../InfoTooltip';

const template = '{\n  "featureStyle": {...},\n  "content": [\n    {"key": "Feature Data"},\n    {"key": "ID", "valueProperty": "id"}\n  ]\n}';

export const HoverJson = ({ layer, controller }) => (
    <Fragment>
        <Message messageKey='hoverJSON'/>
        <InfoTooltip message={<pre>{template}</pre>} />
        <StyledComponent>
            <JsonInput
                rows={6}
                value={layer.tempHoverJSON}
                onChange={evt => controller.setHoverJSON(evt.target.value)} />
        </StyledComponent>
    </Fragment>
);
HoverJson.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};