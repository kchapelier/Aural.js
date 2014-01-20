SCALA file format
=================

Outline
-------

    ! filename (optional)
    Description of the tuning file as the first commented line
    4 ! number of intervals in the tuning
    ! follows the declarations of intervals
    5/4 anything after the interval declaration is ignored
    6/4 this is a frequency ratio notation
    1.75 this is a cents notation, identifiable by the dot
    2 this is an integer frequency ratio notation

Implementation
--------------

Only the parsing of the scala file is implemented so far.

Sources
-------

 * http://www.huygens-fokker.org/scala/
 * http://www.huygens-fokker.org/scala/scl_format.html