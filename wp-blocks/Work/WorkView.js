import styles from './Work.module.css';
import { getLayoutProps } from '@/helpers';
import { WorkItem } from './components/WorkItem';
import { Sidebar } from '@/components/Sidebar';

// function distributeColumns(nodes, count) {
//     const columns = Array.from({ length: count }, () => []);
//     const heights = new Array(count).fill(0);

//     nodes.forEach((work, index) => {
//         const { width, height } = work.featuredImage?.node?.mediaDetails ?? {};
//         const shortest = heights.indexOf(Math.min(...heights));
//         columns[shortest].push({ work, index });
//         heights[shortest] += width && height ? height / width : 1;
//     });

//     return columns;
// }

function splitColumns(nodes) {
    const items = nodes.map((work, index) => {
        const { width, height } = work.featuredImage?.node?.mediaDetails ?? {};

        return { work, index, ratio: width && height ? height / width : 1 };
    });
    const half = items.reduce((sum, { ratio }) => sum + ratio, 0) / 2;

    let split = 0;
    let accumulated = 0;
    let bestDiff = half;

    items.forEach(({ ratio }, i) => {
        accumulated += ratio;
        const diff = Math.abs(accumulated - half);
        if (diff < bestDiff) {
            bestDiff = diff;
            split = i + 1;
        }
    });

    // Running sums of the preceding items' ratios/counts, so CSS can derive each item's
    // top within the pile (height = ratio × width, since every item fills its column).
    // "all" = single-column stack (mobile), "col" = within its own column (desktop).
    let allRatio = 0;
    let allCount = 0;

    return [items.slice(0, split), items.slice(split)].map((column) => {
        let colRatio = 0;

        return column.map((item, colCount) => {
            const out = { ...item, offsets: { allRatio, allCount, colRatio, colCount } };
            allRatio += item.ratio;
            allCount += 1;
            colRatio += item.ratio;
            return out;
        });
    });
}

export function WorkView({
    displayAll,
    displayStyle = 'list',
    work,
    ref,
    linkComponent,
    imgComponent,
    onClick,
    blockSlug,
    getImageProps = null,
    isChild,
    layoutOptions,
}) {
    const workNodes = (work?.nodes ?? []).filter(Boolean);

    if (!workNodes.length) {
        return null;
    }

    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug, getImageProps);
    const sidebarContent = displayAll ? 'Arbeten' : 'Utvalda arbeten';
    const classNames = [...layoutProps.classNames, styles.work, 'grid'];

    if (displayStyle) {
        classNames.push(styles[displayStyle]);
    }

    const renderItem = (work, index, offsets) => (
        <WorkItem
            key={work.id}
            index={index}
            style={
                offsets && {
                    '--before-all': offsets.allRatio,
                    '--count-all': offsets.allCount,
                    '--before-col': offsets.colRatio,
                    '--count-col': offsets.colCount,
                }
            }
            classNames={styles}
            linkComponent={linkComponent}
            imgComponent={imgComponent}
            sizes={
                displayStyle === 'list'
                    ? '(min-width: 768px) 80vmin, 100vw'
                    : '(min-width: 1024px) 40vw, (min-width: 768px) 75vw, calc(100vw - 42px)'
            }
            onClick={onClick}
            {...work}
        />
    );

    return (
        <div ref={ref} {...layoutProps.attributes} className={classNames.join(' ')} style={layoutProps.styles}>
            <Sidebar extraClassNames={['-col -col-1']} fade={displayStyle === 'grid'}>
                {sidebarContent}
            </Sidebar>
            <div className={`${styles.pile} -col -col-10`}>
                {displayAll
                    ? workNodes.map(renderItem)
                    : splitColumns(workNodes).map((column, columnIndex) => (
                          <div key={columnIndex} className={styles.column}>
                              {column.map(({ work, index, offsets }) => renderItem(work, index, offsets))}
                          </div>
                      ))}
            </div>
        </div>
    );
}
