/**
 * @fileOverview <p>{@link concept.view.Constructor}</p>
 * @author John Freeman
 */

/**
 * @name concept.view.Constructor
 * @namespace
 *   <p>
 *   View constructors build (DOM element), compile (HTML string), or otherwise
 *   manufacture a view from a {@link concept.view.Ast}.
 *   </p>
 */

/**
 * @name concept.view.Constructor.construct
 * @description
 *   <p>
 *   Each constructor is expected to produce some meaningful representation of
 *   the widget described to it.  By convention, there are two kinds of
 *   widgets: labeled (or unlabeled) form fields, and general boxes. The
 *   difference matters in layout: fields should be aligned, and boxes should
 *   occupy all available area.
 *   </p>
 *
 *   <p>
 *   Constructors can pass their results to callers by augmenting the tree.
 *   By following these conventions, user-defined constructors can cooperate
 *   with standard constructors:
 *     <ul>
 *       <li>
 *       Fields should be stored with the label and widget kept separate:
 *       <pre>
 *       {
 *         label : \representation\,
 *         widget : \representation\
 *       }
 *       </pre>
 *       </li>
 *
 *       <li>
 *       Boxes should be stored as a single element:
 *       <pre>
 *       {
 *         box : \representation\
 *       }
 *       </pre>
 *       </li>
 *     </ul>
 *   </p>
 *
 *   <p>
 *   A compiler stores an HTML string representation in the tree under the
 *   member "html".
 *   </p>
 *
 *   <p>
 *   A builder stores a DOM element representation in the tree under the member
 *   "element". In addition, a builder may store a
 *   {@link concept.view.Controller} in the tree under the member "view". This
 *   controller can be used later for binding the constructed widget to a
 *   model.
 *   </p>
 *
 * @static
 * @function
 * @param {concept.view.Ast} tree
 */

