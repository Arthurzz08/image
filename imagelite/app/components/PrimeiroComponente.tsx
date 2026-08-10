 'use client'

export function PrimeiroComponente() {

  function clique() {
    console.log('Você clicou no botão!');
    alert('Você clicou no botão!')

  }

  return (
    <div>
      <main>
        <h1>PrimeiroComponente</h1>
        <button onClick={clique}>Clique aqui!</button>
      </main>
    </div>
  )
}