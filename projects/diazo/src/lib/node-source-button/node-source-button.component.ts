import { Component, HostListener, Input, Output } from "@angular/core";
import { DiazoContext } from '../context';
import * as uuid from 'uuid/v4';
import { Subject } from 'rxjs';
import { DiazoNode } from '@diazo/model';
import { Position } from '../common';

/**
 * @category Component
 */
@Component({
    selector: 'dz-node-source-button',
    templateUrl: './node-source-button.component.html',
    styleUrls: ['./node-source-button.component.scss']
})
export class NodeSourceButtonComponent {

    @Input()
    context : DiazoContext;

    @Input()
    template : DiazoNode;

    @Input()
    position : Position;

    @Output()
    inserted = new Subject<void>();
    
    @HostListener('mousedown', ['$event']) 
    onMouseDown(event : MouseEvent) {
        if (!this.context) {
            console.warn(`dz-node-source-button: No context connected, cannot instantiate node`);
            return;
        }
        
        if (!this.template) {
            console.warn(`dz-node-source-button: No template specified, cannot instantiate node`);
            return;
        }
        
        console.log(`Drafting node from ${JSON.stringify(this.template)}`);

        this.context.draftNode = Object.assign(
            {}, 
            this.template,
            <Partial<DiazoNode>>{ 
                id: uuid(),
                x: (this.position || {}).left || 0,
                y: (this.position || {}).top || 0
            }
        );
        this.context.draftEdge = null;

        if (this.context.bufferedEdge) {
            let edge = this.context.bufferedEdge;

            if (!edge.toNodeId) {
                edge.toNodeId = this.context.draftNode.id;
                edge.toSlotId = this.context.draftNode.slots.filter(x => x.type === 'input')[0].id;
            } else {
                edge.fromNodeId = this.context.draftNode.id;
                edge.fromSlotId = this.context.draftNode.slots.filter(x => x.type === 'output')[0].id;
            }
            
            this.context.draftEdge = edge;
        }

        let release = () => {
            document.removeEventListener('mouseup', release);
            
            this.context.releaseDraftNode();
            this.inserted.next();
        };

        document.addEventListener('mouseup', release);
    }
}