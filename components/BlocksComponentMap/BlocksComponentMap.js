import { flatListToHierarchical } from '@faustwp/core';
import * as Blocks from '../blocks';

export const BlocksComponentMap = ({ data: { editorBlocks } }) => {
    const hierarchicalBlocks = flatListToHierarchical(editorBlocks, {
        idKey: 'clientId',
        parentKey: 'parentClientId',
        childrenKey: 'children',
    });

    return (
        <main className="document-content">
            {hierarchicalBlocks?.map((block, index) => blockRenderer(block, index))}
        </main>
    );
};

export const blockRenderer = (
    { __typename: acfTypeName = null, clientId, layoutOptions = null, ...restProps },
    index,
    isChild = false,
    keyPrefix = '',
    renderedIds = new Set(),
) => {
    try {
        const ComponentName = acfTypeName.replace(/^Acf/, '');
        const BlockComponent = Blocks[ComponentName] ?? null;

        if (!BlockComponent) {
            console.warn('No component found for:', ComponentName);
            return null;
        }

        const blockSlug = ComponentName.toLowerCase();
        const { __typename = null, ...blockProps } = restProps[blockSlug] || {};
        const children = restProps.children || [];

        // Prevent circular references
        const blockId = restProps.clientId || restProps.id;

        if (blockId && renderedIds.has(blockId)) {
            console.warn('Circular reference detected for block:', blockId);
            return null;
        }

        const newRenderedIds = new Set(renderedIds);

        if (blockId) {
            newRenderedIds.add(blockId);
        }

        return BlockComponent({
            // key: `${keyPrefix}${blockSlug}-${index}`,
            key: clientId,
            blockSlug,
            layoutOptions,
            isChild,
            ...blockProps,
            children: children.map((child, childIndex) =>
                blockRenderer(child, childIndex, true, `${keyPrefix}${ComponentName}-`, newRenderedIds),
            ),
        });
    } catch (error) {
        console.error('Error rendering block:', error);

        return null;
    }
};
