import React, { Component } from 'react';
import { map } from 'underscore'

// Components
import { Section } from '../../../../components/Section'

import ImgSlider from '../../../../components/Slider/ImgSlider'

import './mobile.scss';

// Icons by paragraph
import MiniImgDnevnik    from '../../../../images/mobile_app/icons/dnevnik.png'
import MiniImgDrop       from '../../../../images/mobile_app/icons/drop.png'
import MiniImgDialysis   from '../../../../images/mobile_app/icons/dialysis.png'
import MiniImgDrugs      from '../../../../images/mobile_app/icons/drugs.png'
import MiniImgDocs       from '../../../../images/mobile_app/icons/docs.png'
import MiniImgFeather    from '../../../../images/mobile_app/icons/feather.png'

// Screens by slider
import ScreenImg1    from '../../../../images/mobile_app/screen/12.png'
import ScreenImg2    from '../../../../images/mobile_app/screen/22.png'
import ScreenImg3    from '../../../../images/mobile_app/screen/32.png'
import ScreenImg4    from '../../../../images/mobile_app/screen/42.png'
import ScreenImg5    from '../../../../images/mobile_app/screen/52.png'
import ScreenImg6    from '../../../../images/mobile_app/screen/62.png'

import AppleStoreImg     from '../../../../images/mobile_app/store/apple_store.png'
import GoogleStoreImg    from '../../../../images/mobile_app/store/google_store.png'

class MobileApp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.text_sections = []
    }

    initScreenSlider(){
      let screen_data = [ ScreenImg1, ScreenImg2, ScreenImg3, ScreenImg4, ScreenImg5, ScreenImg6 ]
      this.setState({mobile_imgs: 
        <div className="ImageStickySlider">
          <ImgSlider img_class="mobile_app_img" data={screen_data}/>
        </div>
      })
    }

    componentDidMount(){
      this.initScreenSlider()

      console.log('mobile_app props', this.props)
      this.text_sections = [
        { Icon: MiniImgDnevnik, text: 'Пациент может вносить показатели состояния здоровья в соответствующем разделе группы "Дневник здоровья". К показателям относятся артериальное давление, пульс и температура' },
        { Icon: MiniImgDrop,    text: 'В разделе "баланс жидкости" пользователь может следить за введенной и выведенной жидкостью в течение суток/недели/месяца' },
        { Icon: MiniImgDialysis,text: 'В приложении предусмотрен раздел "дневниик диализа", где пациент может делать записи об автоматическом или ручном диализе' },
        { Icon: MiniImgDrugs,   text: 'Чтобы не забыть о приеме необходимых лекарств, есть раздел "Прием медикаментов", где можно запланировать прием, сделать запись о незапланированном приеме а также просмотреть историю приема медикаментов' },
        { Icon: MiniImgDocs,    text: 'Также в приложении доступна возможность хранить результаты анализов в удобном формате' },
        { Icon: MiniImgFeather, text: 'Если вам нужно рассказать о чем-то, что не предусмотрено в приложении, вы можете написать заметку в свободной форме, а наши врачи ее увидят' }
      ]
      console.log(this.text_sections)
    }

    render() {
      const apple_link = "https://apps.apple.com/ru/app/медицинский-ассистент/id1553889002"
      const google_link = "https://play.google.com/store/apps/details?id=com.temida.assistant"

      return (
        <div className="home-mobile">
          {/* Инфа + Слайдер */}
          <div className="home-mobile-content">
              <div className="home-mobile-desctiption">
                <Section 
                  id={this.props.mobile_section.section}
                  title={this.props.mobile_section.title}
                  text={this.props.mobile_section.text}
                  content={this.text_content}
                  />
                {map(this.text_sections, ({ Icon, text }) => (
                      <div key={Math.random()} className="home-mobile-content-row">
                        <img className='home-mobile-content-icon' src={Icon} alt=''/>
                        <p className='home-mobile-content-text'>{text}</p>
                      </div>
                    ))}
              </div>
              {this.state.mobile_imgs}
          </div>

          {/* Кнопки со ссылками на маркеты */}
          <div className="home-mobile-store">
            <a href={apple_link} target="_blank" rel="noreferrer" >
              <img className='home-mobile-store-icon' src={AppleStoreImg} alt=''/>
            </a>
            <a href={google_link} target="_blank" rel="noreferrer" >
              <img className='home-mobile-store-icon' src={GoogleStoreImg} alt=''/>
            </a>
          </div>

          {/* Ссылка на пользовательское соглашение под разделительной полоской */}
          <div className="home-mobile-line">
            {/* <a href="/get_licence" target="_blank" rel="noreferrer" >Пользовательское соглашение</a> */}
          </div>
        </div>
      )
    }
}

export default MobileApp;