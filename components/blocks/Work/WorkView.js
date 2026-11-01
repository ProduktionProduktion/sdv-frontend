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

    return [items.slice(0, split), items.slice(split)];
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
    isChild,
    layoutOptions,
}) {
    const workNodes = (work?.nodes ?? []).filter(Boolean);

    if (!workNodes.length) {
        return null;
    }

    const layoutProps = getLayoutProps(layoutOptions || {}, isChild, blockSlug);
    const sidebarContent = displayAll ? 'Arbeten' : 'Utvalda arbeten';
    const classNames = [...layoutProps.classNames, styles.work, 'grid'];

    if (displayStyle) {
        classNames.push(styles[displayStyle]);
    }

    const renderItem = (work, index) => (
        <WorkItem
            key={work.id}
            index={index + 1}
            classNames={styles}
            linkComponent={linkComponent}
            imgComponent={imgComponent}
            sizes={displayStyle === 'list' ? '(min-width: 768px) 80vmin, 100vw' : '(min-width: 768px) 40vw, 100vw'}
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
                              {column.map(({ work, index }) => renderItem(work, index))}
                          </div>
                      ))}
            </div>
        </div>
    );
}
