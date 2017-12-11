import React, { Component } from 'react';

export class PostEditTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteText: `
      # Giving people the opportunity to sit in a dark theater

      A daring escape under cover of darkness. The father shot by government guards as his wife clings to their young son—but all three making it to the water. Three days spent nearly bleeding out in a rickety boat. Pirate attacks. And then, the redemptive miracle of life: a new daughter, born in a Thai refugee camp, who years later would rise to great heights as a first-generation American.

      It’s not a Hollywood plot, though its would-be hero admits that it could be. Perched on a couch in a downtown Manhattan hotel, wearing a floral blouse and mustard cords, Hong Chau recounts her family’s journey among the Vietnamese boat people, refugees who escaped the postwar chaos of the late ’70s, only to die by the hundreds of thousands at sea. “My mom always points to the silver lining,” the 38-year-old actress explains. “She’ll say, ‘Because your dad was so bloody, the pirates didn’t check his pockets. So we still had some money at the camp to buy you baby formula.’”

      In the director Alexander Payne’s new sci-fi satire Downsizing, Chau plays Ngoc Lan Tran, a Vietnamese dissident in a future where people can be shrink-rayed to only a few inches tall. Some of the shrunken are volunteers attempting to save a faltering eco-system, with the added bonus of lavish miniaturized lifestyles financed by their old full-sized dollars. Others, as in Tran’s case, are “downsized” out of political expedience. Chau had no idea what she was in for when she first received the script. “I knew it was sci-fi, so I thought, ‘Oh, maybe I can play a lab technician or something,’” she says. “Usually, of course, it’s the male characters who are the most layered. This is the first time I read a script where the female character was the only role I wanted.”
      `
    };
  }

  render() {
    return (
      <textarea className="text-code" defaultValue={this.state.noteText}></textarea>
    );
  }
}
