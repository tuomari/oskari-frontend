import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { ThemeConsumer } from '../../util';
import { getNavigationTheme } from '../../theme';
import styled from 'styled-components';

// focus and active are only so we don't get the default blue from antd on some occurances.
// Also when the button is "not active" it remains in "focus" so it stays at hover color when the tool is closed
// if we don't actively style it this way
// One option would be to trigger a blur() on the component when active changes to non-active.
// That way tab-focusing would work really nice if we don't force the button to "inactive colors"
const StyledButton = styled(Button)`
    width: ${props => props.size}!important;
    height: ${props => props.size}!important;
    > * {
        font-size: ${props => props.$iconSize};
    }
    border: none;
    opacity: ${props => props.opacity};
    ${(props) => props.rounding && `border-radius: ${props.rounding};`}
    border-radius: ${props => props.rounding};
    color: ${props => props.$active ? props.hover : props.iconcolor};
    fill: ${props => props.$active ? props.hover : props.iconcolor};
    path {
        fill: ${props => props.$active ? props.hover : props.iconcolor};
    }
    background: ${props => props.bg};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        max-width: ${props => props.$iconSize};
        max-height: ${props => props.$iconSize};
    }
    &:hover
    {
        color: ${props => props.hover} !important;
        background: ${props => props.bg}  !important;
        path {
            fill: ${props => props.hover} !important;
        }
    }
    &:focus,
    &:active
    {
        color: ${props => props.$active ? props.hover : props.iconcolor} !important;
        background: ${props => props.bg} !important;
    }
`;

const ThemeButton = ThemeConsumer(({ theme = {}, active, icon, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const iconColor = helper.getTextColor();
    const hover = helper.getButtonHoverColor();
    const rounding = helper.getButtonRoundness();
    const opacity = helper.getButtonOpacity();
    return <StyledButton
        bg={bgColor}
        iconcolor={iconColor}
        hover={hover}
        rounding={rounding}
        opacity={opacity}
        $active={active}
        icon={React.cloneElement(icon, { active })}
        { ...rest }
    />
});

export const MapButton = ({ title, icon, onClick, theme, disabled, size = '32px', iconActive, iconSize = '18px', children, position, ...rest }) => {
    let tooltipPosition = 'top';
    if (position && position.includes('right')) {
        tooltipPosition = 'left';
    } else if (position && position.includes('left')) {
        tooltipPosition = 'right';
    }

    if (title) {
        return (
            <Tooltip title={title} placement={tooltipPosition}>
                    <ThemeButton
                        icon={icon}
                        onClick={onClick}
                        size={size}
                        active={iconActive ? 1 : 0}
                        $iconSize={iconSize}
                        disabled={disabled}
                        { ...rest }
                    />
            </Tooltip>
        );
    } else {
        return (
                <ThemeButton
                    icon={icon}
                    onClick={onClick}
                    size={size}
                    active={iconActive ? 1 : 0}
                    $iconSize={iconSize}
                    disabled={disabled}
                    { ...rest }
                />
        );
    }
};

MapButton.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func
};
