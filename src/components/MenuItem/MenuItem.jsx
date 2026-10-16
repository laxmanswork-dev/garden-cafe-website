import { cafe } from '../../data/cafeData'
import Button from '../Button/Button'
import MenuImage from '../MenuImage/MenuImage'
import WhatsAppIcon from '../WhatsAppIcon/WhatsAppIcon'
import './MenuItem.css'

/**
 * One dish on the menu: its photograph, its number within its section,
 * its name, and "Order on WhatsApp" — which opens the cafe's chat with
 * the dish named and a request to confirm its price and availability.
 * No descriptions or prices until Garden Cafe supplies them.
 *
 * @param {object} props
 * @param {import('../../data/menuData').MenuItem} props.item
 * @param {number} props.number     1-based, within the section
 * @param {string} [props.sizes]
 * @param {boolean} [props.priority]
 */
export default function MenuItem({ item, number, sizes, priority = false }) {
  return (
    <article className="menu-item">
      <MenuImage
        src={item.image}
        alt={item.alt}
        itemName={item.name}
        objectPosition={item.objectPosition}
        sizes={sizes}
        priority={priority}
      />
      <span className="menu-item__number eyebrow text-tabular" aria-hidden="true">
        {String(number).padStart(2, '0')}
      </span>
      <h3 className="menu-item__name">{item.name}</h3>
      <Button
        variant="secondary"
        size="sm"
        className="menu-item__order"
        href={cafe.whatsapp.orderHref(item.name)}
        iconStart={<WhatsAppIcon />}
        aria-label={`Order on WhatsApp: ${item.name}`}
      >
        Order on WhatsApp
      </Button>
    </article>
  )
}
