A ModelController wraps a [Model](Model.md) and adds support for the Observer pattern. It forwards the Model interface and adds one function:

  * **`ModelController::`**
    * **`observe(name, callback)`** <br> Registers an observer for the named event. Callbacks will be passed an instance of the Model which they can query for information.