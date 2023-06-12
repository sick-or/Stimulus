import { Application } from "@hotwired/stimulus"

import DragController from "./drag_controller"

window.Stimulus = Application.start()
Stimulus.register("drag", DragController)
