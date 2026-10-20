import { flatListToHierarchical } from '@faustwp/core';
import * as Blocks from '../blocks';

export const BlocksComponentMap = ({data: {editorBlocks}}) => {
    const hierarchicalBlocks = flatListToHierarchical(editorBlocks, {
        idKey: 'clientId',
        parentKey: 'parentClientId',
        childrenKey: 'children'
    });
    
    return hierarchicalBlocks?.map((block, index) => blockRenderer(block, index));
};


const blockRenderer = (block, index, isColumn = false) => {
    const { name: acfBlockName, __typename: acfTypeName, layoutOptions, ...restProps } = block;
    const blockName = acfTypeName.replace(/^Acf/, '');
    const BlockComponent = Blocks[blockName] ?? null;
    
    if (!BlockComponent) {
        return null;
    }
    
    const propKey = blockName.toLowerCase();
    const {__typename=null, ...blockProps} = restProps[propKey] || {};
    const children = restProps.children || [];
    // const layoutProps = getLayoutProps(layoutOptions, propKey, isColumn);
    
    return <BlockComponent 
        key={`${blockName}-${index}`}
        layoutOptions={layoutOptions}
        {...blockProps}
    >
      {children.map((child, childIndex) => blockRenderer(child, childIndex, true))}
    </BlockComponent>;
};

// const flatListToHierarchical = (
//     data = [],
//     {idKey='key',parentKey='parentId',childrenKey='children'} = {}
// ) => {
//     const tree = [];
//     const childrenOf = {};

//     data.forEach((item) => {
//         const newItem = {...item};
//         const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
//         childrenOf[id] = childrenOf[id] || [];
//         newItem[childrenKey] = childrenOf[id];
//         parentId
//             ? (
//                 childrenOf[parentId] = childrenOf[parentId] || []
//             ).push(newItem)
//             : tree.push(newItem);
//     });
//     return tree;
// };
