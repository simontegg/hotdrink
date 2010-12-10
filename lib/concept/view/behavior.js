/**
 * @fileOverview <p>{@link concept.view.Behavior}</p>
 * @author John Freeman
 */

/**
 * @name concept.view.Behavior
 * @namespace
 *   <p>
 *   A view behavior encapsulates function templates for handling how widgets
 *   reflect or modify information in the model. The function templates are
 *   typically higher-order functions whose arguments provide the implementation
 *   details specific to each widget type. Using this technique, a whole library
 *   of widgets can more easily get uniform support for a particular
 *   {@link concept.model.Behavior}.
 *   </p>
 */

/**
 * @name concept.view.Behavior.registerWidgets
 * @description
 *   Builds visitors that handle widget support for some
 *   {@link concept.model.Behavior} and registers them with a
 *   {@link hotdrink.controller.Factory}.
 * @function
 * @param {hotdrink.controller.Factory} factory
 * @param {BehaviorRegistry} registry
 *   <pre>
 *   BehaviorRegistry ::=
 *   [ {
 *     type : [/widget-type-name/] | /widget-type-name/,
 *     subprocedure : function (...) { ... },
 *     ...
 *   } ]
 *   </pre>
 *   <p>
 *   Each object in the registry provides subprocedures that implement the
 *   lower-level, widget-specific details of the view behavior. These are
 *   plugged into templated visitors that are registered with a
 *   {@link hotdrink.controller.Factory}. Each behavior should document the
 *   subprocedures it accepts or requires.
 *   </p>
 */

