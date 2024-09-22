import React from 'react';
import EditTodos from '../../_components/EditTodos';

interface IParmas {
  params: {
    id: string;
  };
}

export default function EditTodo({ params }: IParmas) {
  return <EditTodos id={params.id} />;
}
