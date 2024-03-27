import { createMachine, createActor } from 'xstate';


const orderStateMachine = createMachine({
  id: 'order',
  initial: 'created',
  states: {
    created: {
      on: {
        PICK_UP: 'pickedUp',
        CANCEL: 'cancelled',
      },
    },
    pickedUp: {
      on: {
        DELIVER: 'delivered',
        RETURN: 'returning',
      },
    },
    delivered: {
      type: 'final',
    },
    returning: {
      on: {
        RETURNED: 'returned',
      },
    },
    returned: {
      type: 'final',
    },
    cancelled: {
      type: 'final',
    },
  },
});


const actor = createActor(orderStateMachine);

