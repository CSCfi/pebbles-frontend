export const EXAMPLE_COLOR = `
    <!-- A. Generate Contextual Classes -->
    <!-- Parent's theme inherits to children -->
    <!-- defaults to "neut", if theme context is not given,  -->
    <!-- E.g, class="warn" -> class"clr-0..." --> 
    <div class="color-sample">
      <div class="clr-0">neut clr-0</div>
      <div class="clr-1">neut clr-1</div>
      <div class="clr-2">neut clr-2</div>
      <div class="clr-3">neut clr-3</div>
      <div class="clr-4">neut clr-4</div>
      <div class="clr-5">neut clr-5</div> 
      <div class="clr-6">neut clr-6</div>
      <div class="clr-7">neut clr-7</div>
      <div class="clr-8">neut clr-8</div>
      <div class="clr-9">neut clr-9</div>
    </div>
    <div class="color-sample prim">
      <div class="clr-0">prim clr-0</div>
      <div class="clr-1">prim clr-1</div>
      <div class="clr-2">prim clr-2</div>
      <div class="clr-3">prim clr-3</div>
      <div class="clr-4">prim clr-4</div>
      <div class="clr-5">prim clr-5</div>
      <div class="clr-6">prim clr-6</div>
      <div class="clr-7">prim clr-7</div>
      <div class="clr-8">prim clr-8</div>
      <div class="clr-9">prim clr-9</div>
    </div>
    <div class="color-sample sec">
      <div class="clr-0">sec clr-0</div>
      <div class="clr-1">sec clr-1</div>
      <div class="clr-2">sec clr-2</div>
      <div class="clr-3">sec clr-3</div>
      <div class="clr-4">sec clr-4</div>
      <div>sec clr-5</div><!-- defaults to level 5, if lightness level is not been given -->
      <div class="clr-6">sec clr-6</div>
      <div class="clr-7">sec clr-7</div>
      <div class="clr-8">sec clr-8</div>
      <div class="clr-9">sec clr-9</div>
    </div>
    <!-- Theme class is applied to own element and inherits to children --> 
    <!-- E.g, class="acc clr-0..." --> 
    <div class="color-sample">
      <div class="acc clr-0">acc clr-0</div>
      <div class="acc clr-1">acc clr-1</div>
      <div class="acc clr-2">acc clr-2</div>
      <div class="acc clr-3">acc clr-3</div>
      <div class="acc clr-4">acc clr-4</div>
      <div class="acc clr-5">acc clr-5</div>
      <div class="acc clr-6">acc clr-6</div>
      <div class="acc clr-7">acc clr-7</div>
      <div class="acc clr-8">acc clr-8</div>
      <div class="acc clr-9">acc clr-9</div>
    </div>
    <!-- C. Specific Theme Classes  -->
    <!-- Only applied to the own element. Do not inherit to children --> 
    <!-- E.g, class="warn-clr-0..." --> 
    <div class="color-sample">
      <div class="warn-clr-0">warn clr-0</div>
      <div class="warn-clr-1">warn clr-1</div>
      <div class="warn-clr-2">warn clr-2</div>
      <div class="warn-clr-3">warn clr-3</div>
      <div class="warn-clr-4">warn clr-4</div>
      <div class="warn-clr-5">warn clr-5</div>
      <div class="warn-clr-6">warn clr-6</div>
      <div class="warn-clr-7">warn clr-7</div>
      <div class="warn-clr-8">warn clr-8</div>
      <div class="warn-clr-9">warn clr-9</div>
    </div>
`;