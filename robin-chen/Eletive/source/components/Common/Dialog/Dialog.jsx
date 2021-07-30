import React from 'react';
import PropTypes from 'prop-types';
import { Dialog as BlueprintDialog, Icon, Position } from '@blueprintjs/core';

import { isMobileVersion } from 'utilities/common';

import { SidePanel } from 'Components/Common';

import * as Models from 'Models';

const DefaultMobileProps = {
  size: '50%',
};

export const Dialog = (props) => {
  const { children, isOpen, ...restProps } = props;

  if (isMobileVersion) {
    const {
      icon,
      title,
      mobile = DefaultMobileProps,
    } = props;

    return (
      <SidePanel isOpen={isOpen} size={mobile.size} position={Position.BOTTOM}>
        <div>
          {
            title &&
            <div className="bp3-dialog-header">
              {
                icon &&
                <Icon icon={icon} />
              }

              <h4 className="bp3-heading">{title}</h4>
            </div>
          }

          {children}
        </div>
      </SidePanel>
    );
  }

  return (
    <BlueprintDialog {...restProps} isOpen={isOpen}>
      {children}
    </BlueprintDialog>
  );
};

Dialog.propTypes = {
  icon: PropTypes.string,
  title: Models.Common.RenderableElement,
  children: Models.Common.RenderableElement,
  isOpen: PropTypes.bool,
  mobile: PropTypes.shape({
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};

Dialog.defaultProps = {
  isOpen: false,
};
