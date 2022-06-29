// https://github.com/austinhallock/ReactShadow
// modified so refs are immediately available in useEffects
// (content is mounted even if portal is not ready)
import React, { useState, useEffect, forwardRef } from 'https://npm.tfl.dev/react';
import { useEnsuredForwardedRef } from 'https://npm.tfl.dev/react-use@17';
import { createPortal } from 'https://npm.tfl.dev/react-dom';
import PropTypes from 'https://npm.tfl.dev/prop-types@15';
import * as utils from './utils.js';

function ShadowContent({ root, children }) {
    return root ? createPortal(children, root) : <>{children}</>;
}

ShadowContent.propTypes = {
    root: PropTypes.object.isRequired,
    children: PropTypes.node,
};

ShadowContent.defaultProps = { children: null };

export default function create(options) {
    const ShadowRoot = forwardRef(
        (
            { mode, delegatesFocus, styleSheets, ssr, children, ...props },
            ref,
        ) => {
            const node = useEnsuredForwardedRef(ref);
            const [root, setRoot] = useState(null);
            const key = `node_${mode}${delegatesFocus}`;

            useEffect(() => {
                if (node.current) {
                    try {
                        typeof ref === 'function' && ref(node.current);

                        if (ssr) {
                            const root = node.current.shadowRoot;
                            setRoot(root);
                            return;
                        }

                        const root = node.current.attachShadow({
                            mode,
                            delegatesFocus,
                        });
                        styleSheets.length > 0 &&
                            (root.adoptedStyleSheets = styleSheets);
                        setRoot(root);
                    } catch (error) {
                        utils.handleError({ error, styleSheets, root });
                    }
                }
            }, [ref, node, styleSheets]);

            return (
                <>
                    <options.tag key={key} ref={node} {...props}>
                        <utils.Context.Provider value={root}>
                            {ssr ? (
                                <template shadowroot="open">
                                    {options.render({
                                        root,
                                        ssr,
                                        children,
                                    })}
                                </template>
                            ) : (
                                <ShadowContent root={root}>
                                    {options.render({
                                        root,
                                        ssr,
                                        children,
                                    })}
                                </ShadowContent>
                            )}
                        </utils.Context.Provider>
                    </options.tag>
                </>
            );
        },
    );

    ShadowRoot.propTypes = {
        mode: PropTypes.oneOf(['open', 'closed']),
        delegatesFocus: PropTypes.bool,
        styleSheets: PropTypes.arrayOf(
            PropTypes.instanceOf(globalThis.CSSStyleSheet),
        ),
        ssr: PropTypes.bool,
        children: PropTypes.node,
    };

    ShadowRoot.defaultProps = {
        mode: 'open',
        delegatesFocus: false,
        styleSheets: [],
        ssr: false,
        children: null,
    };

    return ShadowRoot;
}