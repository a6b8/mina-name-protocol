import {
  Field,
  SmartContract,
  state,
  State,
  method,
} from 'snarkyjs';
export class Main extends SmartContract {
    events = { 'easyMina': Field, 'mns': Field };
    @state(Field) num = State<Field>();
    
    
    init() {
        super.init();
        this.num.set( Field( 3 ) );
        this.emitEvent( 'easyMina', Field( 123456789 ) );
    }
    
    @method update( square: Field ) {
        const currentState = this.num.get();
        this.num.assertEquals( currentState );
        square.assertEquals( currentState.mul( currentState ) );
        this.num.set( square );
    }

    @method mns( square: Field ) {
        this.emitEvent( 'mns', Field( square ) );
    }
}