import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
	sort() {
		document.addEventListener('DOMContentLoaded', () => {
        const table = document.getElementById('table');

        let draggingEle;
        let draggingRowIndex;
        let isDraggingStarted = false;
        let list;
        let placeholder;

        // holds current position of mouse relative to dragging element
        let x = 0;
        let y = 0;

        // Swap two nodes.
        function swap(nodeA, nodeB) {
          const siblingA =
            nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

          // Move nodeA to before the nodeB.
          nodeB.parentNode.insertBefore(nodeA, nodeB);

          // Move nodeB to before the sibling of nodeA.
          nodeA.parentNode.insertBefore(nodeB, siblingA);
        }

        // Check if nodeA is above nodeB.
        function isAbove(nodeA, nodeB) {
          // Get the bounding rectangle of nodes.
          const rectA = nodeA.getBoundingClientRect();
          const rectB = nodeB.getBoundingClientRect();

          return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
        }

        const cloneTable = () => {
          const rect = table.getBoundingClientRect();
          const width = parseInt(window.getComputedStyle(table).width);

          list = document.createElement('div');
          list.classList.add('clone-list');
          list.style.position = 'absolute';
          list.style.left = `${rect.left}px`;
          list.style.top = `${rect.top}px`;
          table.parentNode.insertBefore(list, table);

          // Hide the original table.
          table.style.visibility = 'hidden';

          table.querySelectorAll('tr').forEach(row => {
            // Create a new table from given row.
            const item = document.createElement('div');
            item.classList.add('draggable');

            const newTable = document.createElement('table');
            newTable.setAttribute('class', 'clone-table');
            newTable.style.width = `${width}px`;

            const newRow = document.createElement('tr');
            const cells = [].slice.call(row.children);
            cells.forEach(cell => {
              const newCell = cell.cloneNode(true);
              newCell.style.width = `${parseInt(
                window.getComputedStyle(cell).width
              )}px`;
              newRow.appendChild(newCell);
            });

            newTable.appendChild(newRow);
            item.appendChild(newTable);
            list.appendChild(item);
          });
        };

        const mouseDownHandler = e => {
          // Get original row.
          const originalRow = e.target.parentNode;
          draggingRowIndex = [].slice
            .call(table.querySelectorAll('tr'))
            .indexOf(originalRow);

          // Determine mouse position.
          x = e.clientX;
          y = e.clientY;

          // Attach the listeners to document.
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = e => {
          if (!isDraggingStarted) {
            isDraggingStarted = true;

            cloneTable();

            draggingEle = [].slice.call(list.children)[draggingRowIndex];
            draggingEle.classList.add('dragging');

            // Let placeholder take height of dragging element
            // so next element won't move up.
            placeholder = document.createElement('div');
            placeholder.classList.add('placeholder');
            draggingEle.parentNode.insertBefore(
              placeholder,
              draggingEle.nextSibling
            );
            placeholder.style.height = `${draggingEle.offsetHeight}px`;
          }

          // Set position for dragging element.
          draggingEle.style.position = 'absolute';
          draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
          draggingEle.style.left = `${
            draggingEle.offsetLeft + e.clientX - x
          }px`;

          // Reassign position of mouse.
          x = e.clientX;
          y = e.clientY;

          // The current order is prevEle, draggingEle, placeholder, nextEle.
          const prevEle = draggingEle.previousElementSibling;
          const nextEle = placeholder.nextElementSibling;

          // If the dragging element is above the previous element
          // and the user moves the dragging element to the top,
          // don't allow to drop above the header
          // (which doesn't have `previousElementSibling`).
          if (
            prevEle &&
            prevEle.previousElementSibling &&
            isAbove(draggingEle, prevEle)
          ) {
            // current order -> new order
            // prevEle       -> placeholder
            // draggingEle   -> draggingEle
            // placeholder   -> prevEle
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
          }

          // If the dragging element is below the next element
          // and the ser moves the dragging element to the bottom ...
          if (nextEle && isAbove(nextEle, draggingEle)) {
            // current order -> new order
            // draggingEle   -> nextEle
            // placeholder   -> placeholder
            // nextEle       -> draggingEle
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
          }
        };

        const mouseUpHandler = () => {
          // Remove placeholder.
          placeholder && placeholder.parentNode.removeChild(placeholder);

          draggingEle.classList.remove('dragging');
          draggingEle.style.removeProperty('top');
          draggingEle.style.removeProperty('left');
          draggingEle.style.removeProperty('position');

          const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);

          isDraggingStarted = false;

          // Remove list element.
          list.parentNode.removeChild(list);

          // Move dragged row to endRowIndex.
          let rows = [].slice.call(table.querySelectorAll('tr'));
          draggingRowIndex > endRowIndex
            ? rows[endRowIndex].parentNode.insertBefore(
                rows[draggingRowIndex],
                rows[endRowIndex]
              )
            : rows[endRowIndex].parentNode.insertBefore(
                rows[draggingRowIndex],
                rows[endRowIndex].nextSibling
              );

          // Bring back the table.
          table.style.removeProperty('visibility');

          // Remove handlers of mousemove and mouseup.
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        };

        table.querySelectorAll('tr').forEach((row, index) => {
          // Ignore the header so the user cannot move it.
          if (index === 0) return;

          // Allow dragging only by first cell of each row.
          // const firstCell = row.firstElementChild;
          // firstCell.classList.add('draggable');
          // firstCell.addEventListener('mousedown', mouseDownHandler);

          //TODO: Consider adding a first column of drag handle icons
          //TODO: and only dragging by those.

          // Allow dragging by any cell.
          for (const cell of row.children) {
            cell.classList.add('draggable');
            cell.addEventListener('mousedown', mouseDownHandler);
          }
        });
      });
	}
}